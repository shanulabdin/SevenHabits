import DayRing from '@/components/DayRing';
import HabitCard from '@/components/HabitCard';
import Heading from '@/components/Heading';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";


function getDateKey(d = new Date()) {
  return d.toISOString().split("T")[0]; // "2026-01-20"
}

export type Habit = {
  id: string;
  title: string;
  history: Record<string, boolean>;
};

const STORAGE_KEY = "@sevenhabits/habits_v1";

export default function Index() {
  const todayKey = getDateKey();
  function addDays(dateKey: string, offset: number) {
    const d = new Date(dateKey);
    d.setDate(d.getDate() + offset);
    return getDateKey(d);
  }

  const yesterdayKey = addDays(getDateKey(), -2);
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);

  const selectedLabel = new Date(selectedDateKey).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });

  const headingTitle = selectedDateKey === todayKey ? `Today, ${selectedLabel}` : `${selectedLabel}`;

  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Drink Water', history: { [todayKey]: false } },
    { id: '2', title: 'Exercise', history: { [todayKey]: true, [yesterdayKey]: true } },
    { id: '3', title: 'Read a Book', history: { [todayKey]: true } },
    { id: '4', title: 'Meditate', history: { [todayKey]: true } },
    { id: '5', title: 'Sleep Early', history: { [todayKey]: false } },
  ]);
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

  const totalCount = habits.length;

  const doneCount = habits.reduce((sum, habit) => {
    const doneSelectedDay = habit.history[selectedDateKey] === true;
    return sum + (doneSelectedDay ? 1 : 0);
  }, 0)

  const percent = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  function getLastNDays(n: number) {
    const days: Date[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  }

  function getPercentForDate(dateKey: string) {
    const total = habits.length;
    if (total === 0) return 0;

    const done = habits.reduce((sum, h) => sum + (h.history?.[dateKey] === true ? 1 : 0), 0);
    return Math.round((done / total) * 100);
  }

  const weekStats = useMemo(() => {
    const last7 = getLastNDays(7);

    return last7.map(d => {
      const dateKey = getDateKey(d);
      return {
        key: dateKey,
        dateKey,
        dayNumber: d.getDate().toString(),
        dayLabel: d.toLocaleDateString(undefined, { weekday: "short" }),
        percent: getPercentForDate(dateKey),
      };
    });
  }, [habits]);



  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingHabitTitle, setEditingHabitTitle] = useState<string>('');

  const scrollRef = useRef<ScrollView>(null)

  const { newHabit } = useLocalSearchParams<{ newHabit?: string }>();

  useEffect(() => {
    if (newHabit) {
      createHabit(newHabit);
    }
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

  function createHabit(title: string) {
    if (title.trim() === '') return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      title: title.trim(),
      history: {
        [selectedDateKey]: false,
      },
    };

    setHabits(prev => [...prev, newHabit]);
  }

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-colors-dark">
      <View
        className="flex-1 items-center bg-colors-dark p-3 pt-20 w-full"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 350 }}
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: "#151515" }}
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >

          <Heading
            title={headingTitle}
            iconTitle={`${percent}%`}
            icon="pie-chart"
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
                      bg-colors-background
                      rounded-tr-2xl
                      rounded-bl-2xl
                      mb-4
                      h-30
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
                        height: 48,
                        lineHeight: 24,
                        paddingVertical: 0,        // important
                        includeFontPadding: false, // Android: removes extra top/bottom padding
                        textAlignVertical: "center", // Android: centers text vertically
                        marginLeft: 4,
                      }}
                      className="text-colors-text text-xl text-center px-6"
                    />

                  </View>

                );
              }

              const checkedSelectedDay = habit.history[selectedDateKey] === true;

              return (
                <HabitCard
                  key={habit.id}
                  title={habit.title}
                  checked={checkedSelectedDay}
                  markComplete={() => toggleHabit(habit.id)}
                  onLongPress={longPressHabit(habit.id)}
                />
              );
            })
          }

        </ScrollView>

        <Modal visible={isModalVisible} transparent animationType="fade" className=''>
          <Pressable
            className="flex-1 bg-black/50 items-center justify-center"
            onPress={() => {
              setIsModalVisible(false);
              setSelectedHabitId(null);
            }}

          >
            <Pressable
              className="bg-colors-background rounded-xl w-64 border-o border-[1px]"
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
                <Text className="text-colors-text  border-b-[1px] border-b-o p-4 text-xl">Edit</Text>
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
