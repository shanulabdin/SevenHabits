import DayRing from '@/components/DayRing';
import HabitCard from '@/components/HabitCard';
import Heading from '@/components/Heading';
import { Habit } from '@/types/habit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";


// Utils
import { useThemeColors } from '@/constants/theme';
import { getDateKey, getLastNDays } from '@/utils/date';
import { getPercentForDate, getWeeklyPercent } from '@/utils/stats';
import { getHabitStreakWithGrace } from '@/utils/streaks';

const STORAGE_KEY = "@sevenhabits/habits_v1";

export default function Index() {
  const { colors } = useThemeColors();

  // Heading date
  const todayKey = getDateKey();
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const selectedLabel = new Date(selectedDateKey).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
  const headingTitle = selectedDateKey === todayKey ? `Today, ${selectedLabel}` : `${selectedLabel}`;

  const router = useRouter();

  // Setting habits
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Code', history: { [todayKey]: false }, showGrid: true },
    { id: '2', title: 'Workout', history: { [todayKey]: false }, showGrid: false },
    { id: '3', title: 'Read 1 Page', history: { [todayKey]: false }, showGrid: true },
    { id: '4', title: 'Meditate', history: { [todayKey]: false }, showGrid: false },
    { id: '5', title: 'Sleep Early', history: { [todayKey]: false }, showGrid: false },
  ]);

  // Async Storage --|
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw);

        // Safety: ensure it's an array
        if (!Array.isArray(parsed)) return;

        // Optional migration / cleanup (handles old shapes gracefully)
        const cleaned: Habit[] = parsed
          .map((h: any) => {
            if (!h?.id || !h?.title) return null;

            // If old format exists (checked boolean), convert to history for today
            if (!h.history && typeof h.checked === "boolean") {
              return {
                id: String(h.id),
                title: String(h.title),
                history: { [todayKey]: h.checked },
              } satisfies Habit;
            }

            // Normal new format
            if (h.history && typeof h.history === "object") {
              return {
                id: String(h.id),
                title: String(h.title),
                history: h.history as Record<string, boolean>,
                showGrid: typeof h.showGrid === "boolean" ? h.showGrid : true,
              } satisfies Habit;
            }

            return null;
          })
          .filter((h): h is Habit => h !== null);


        if (cleaned.length) setHabits(cleaned);
      } catch (e) {
        console.log("Failed to load habits:", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
      } catch (e) {
        console.log("Failed to save habits:", e);
      }
    })();
  }, [habits]);

  async function resetAllData() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setHabits([]); // or setHabits(defaultHabits)
    } catch (e) {
      console.log("Failed to reset storage:", e);
    }
  }
  // Async Storage --|

  // Weekly stats
  const weekStats = useMemo(() => {
    const last7 = getLastNDays(7);

    return last7.map(d => {
      const dateKey = getDateKey(d);
      return {
        key: dateKey,
        dateKey,
        dayNumber: d.getDate().toString(),
        dayLabel: d.toLocaleDateString(undefined, { weekday: "short" }),
        percent: getPercentForDate(habits, dateKey),
      };
    });
  }, [habits]);

  // Weekly overall percentage --|
  const weekDateKeys = weekStats.map(d => d.dateKey);
  const weeklyPercent = getWeeklyPercent(habits, weekDateKeys);
  // Weekly overall percentage --|



  // Other Hooks --|
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingHabitTitle, setEditingHabitTitle] = useState<string>('');

  const scrollRef = useRef<ScrollView>(null)

  const { newHabit } = useLocalSearchParams<{ newHabit?: string }>();



  // Other Hooks --|

  // Basic Functions
  function toggleHabit(id: string) {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id !== id) return habit;

        const current = habit.history[selectedDateKey] === true;

        return {
          ...habit,
          history: {
            ...habit.history,
            [selectedDateKey]: !current,
          },
        };
      })
    );
  }

  const createHabit = useCallback((title: string) => {
    if (title.trim() === '') return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      title: title.trim(),
      history: {
        [selectedDateKey]: false,
      },
      showGrid: false,
    };

    setHabits(prev => [...prev, newHabit]);
  }, [selectedDateKey]);


  const consumedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!newHabit) return;
    if (consumedRef.current === newHabit) return;

    consumedRef.current = newHabit;
    createHabit(newHabit);
    router.setParams({ newHabit: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newHabit]);


  useEffect(() => {
    setHabits(prev =>
      prev.map(h => {
        if (h.history[todayKey] !== undefined) return h;
        return {
          ...h,
          history: {
            ...h.history,
            [todayKey]: false,
          },
        };
      })
    );
  }, [todayKey]);

  function deleteHabit(id: string) {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    setIsModalVisible(false);
    setSelectedHabitId(null);
  }

  function longPressHabit(id: string) {
    return () => {
      setSelectedHabitId(id);
      setIsModalVisible(true);
    };
  }

  function startEditingHabit(id: string) {
    const habit = habits.find(habit => habit.id === id);
    if (!habit) return;

    setIsModalVisible(false);

    setTimeout(() => {
      setEditingHabitId(habit.id);
      setEditingHabitTitle(habit.title);
    }, 50);
  }

  function saveEditingHabit(id: string) {
    if (editingHabitTitle.trim() === '') {
      setEditingHabitId(null);
      setEditingHabitTitle('');
      return;
    }

    setHabits(prev => prev.map(h =>
      h.id === id ? { ...h, title: editingHabitTitle.trim() } : h
    ));
    setEditingHabitId(null);
    setEditingHabitTitle('');
  }

  // Toggle Grid for habit
  function toggleGridForHabit(id: string) {
    setHabits(prev =>
      prev.map(h =>
        h.id === id ? { ...h, showGrid: !(h.showGrid ?? true) } : h
      )
    );
  }

  const selectedHabit = selectedHabitId
    ? habits.find(h => h.id === selectedHabitId)
    : null;

  const gridLabel = selectedHabit?.showGrid ?? true ? "Hide Grid" : "Show Grid";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.dark }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{ flex: 1, backgroundColor: colors.dark, padding: 12, paddingTop: 80, width: "100%", alignItems: "center" }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 350 }}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1, backgroundColor: colors.dark }}
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >

          <Heading
            title={headingTitle}
            iconTitle={`${weeklyPercent}%`}
            icon="pie-chart"
            onIconPress={() => router.push("/stats")}
          />

          <View className="flex-row justify-between w-full px-1 mt-4 mb-4">
            {weekStats.map(d => (
              <DayRing
                key={d.key}
                dayNumber={d.dayNumber}
                dayLabel={d.dayLabel}
                percent={d.percent}
                selected={d.dateKey === selectedDateKey}
                onPress={() => setSelectedDateKey(d.dateKey)}
              />
            ))}
          </View>

          {
            habits.map(habit => {
              const isEditing = editingHabitId === habit.id;

              if (isEditing) {
                return (
                  <View
                    key={habit.id}
                    className="
                      w-full
                      bg-colors-dark
                      border-[1px]
                      rounded-tr-2xl
                      rounded-bl-2xl
                      mb-3
                      justify-center
                    "
                    onLayout={(e) => {
                      const y = e.nativeEvent.layout.y;
                      scrollRef.current?.scrollTo({ y: Math.max(0, y - 80), animated: true });
                    }}
                  >
                    <TextInput
                      value={editingHabitTitle}
                      onChangeText={setEditingHabitTitle}
                      autoFocus
                      returnKeyType="done"
                      maxLength={24}
                      onSubmitEditing={() => saveEditingHabit(habit.id)}
                      onBlur={() => saveEditingHabit(habit.id)}
                      style={{
                        fontFamily: "Poppins_600SemiBold",
                        height: 54,
                        lineHeight: 24,
                        includeFontPadding: false, // Android: removes extra top/bottom padding
                        textAlignVertical: "center", // Android: centers text vertically
                      }}
                      className="text-colors-text text-xl text-start px-4"
                    />

                  </View>

                );
              }

              const checkedSelectedDay = habit.history[selectedDateKey] === true;
              const streak = getHabitStreakWithGrace(habit, selectedDateKey, todayKey);

              return (
                <HabitCard
                  key={habit.id}
                  title={habit.title}
                  checked={checkedSelectedDay}
                  streak={streak}
                  history={habit.history}   // ✅
                  todayKey={todayKey}       // ✅
                  showGrid={habit.showGrid ?? true}
                  markComplete={() => toggleHabit(habit.id)}
                  onLongPress={longPressHabit(habit.id)}
                />

              );
            })
          }
          <Pressable
            onPress={resetAllData}
            className="self-end mb-3 px-3 py-2 rounded-lg bg-colors-dark  border-black"
          >
            <Text className="text-colors-orange">Reset Data</Text>
          </Pressable>

        </ScrollView>

        <Modal visible={isModalVisible} transparent animationType="fade" className="border-r-0">
          <Pressable
            className="flex-1 bg-black/50 items-center justify-center"
            onPress={() => {
              setIsModalVisible(false);
              setSelectedHabitId(null);
            }}

          >
            <Pressable
              className="bg-colors-dark rounded-tr-2xl rounded-bl-2xl w-64 border-black border-[1px]"
              onPress={() => {
                setIsModalVisible(false);
                setSelectedHabitId(null);
              }}
            >
              <Pressable onPress={() => {
                if (!selectedHabitId) return;
                // Edit the habit
                startEditingHabit(selectedHabitId);
              }}>
                <Text className="text-colors-text  border-b-[1px] border-b-black p-4 text-xl">Edit</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (!selectedHabitId) return;
                  toggleGridForHabit(selectedHabitId);
                  setIsModalVisible(false);
                  setSelectedHabitId(null);
                }}
              >
                <Text className="text-colors-text border-b-[1px] border-b-black p-4 text-xl">
                  {gridLabel}
                </Text>
              </Pressable>

              <Pressable onPress={() => {
                if (!selectedHabitId) return;
                deleteHabit(selectedHabitId!);
              }}>
                <Text className="text-colors-orange text-xl p-4">Delete</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}
