import DayRing from '@/components/DayRing';
import HabitCard from '@/components/HabitCard';
import Heading from '@/components/Heading';
import { Habit } from '@/types/habit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Utils
import { useThemeColors } from '@/constants/theme';
import { getDateKey, getLastNDays } from '@/utils/date';
import { getPercentForDate, getWeeklyPercent } from '@/utils/stats';
import { getHabitStreakWithGrace } from '@/utils/streaks';
import { Ionicons } from '@expo/vector-icons';

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
      style={[styles.kav]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          style={[styles.scroll, { backgroundColor: colors.background }]}
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

          {/* Week rings row */}
          <View style={styles.weekRow}>
            {weekStats.map((d) => (
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

          {habits.map((habit) => {
            const isEditing = editingHabitId === habit.id;

            if (isEditing) {
              return (
                <View
                  key={habit.id}
                  style={[styles.editCard, { backgroundColor: colors.card, borderColor: colors.border }]}
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
                    style={[
                      styles.editInput,
                      { color: colors.text, fontFamily: "Poppins_600SemiBold" },
                    ]}
                    placeholder="Edit habit"
                    placeholderTextColor={colors.text + "99"} // optional
                  />

                  <Pressable
                    onPress={() => saveEditingHabit(habit.id)}
                    hitSlop={12}
                    style={[
                      styles.editSubmitBtn,
                    ]}
                  >
                    <Ionicons name="add-sharp" size={32} color={colors.orange} />
                  </Pressable>
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
                history={habit.history}
                todayKey={todayKey}
                showGrid={habit.showGrid ?? true}
                markComplete={() => toggleHabit(habit.id)}
                onLongPress={longPressHabit(habit.id)}
              />
            );
          })}

          {/* Reset button */}
          <Pressable
            onPress={resetAllData}
            style={[styles.resetBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.resetText, { color: colors.accent }]}>
              Reset Data
            </Text>
          </Pressable>
        </ScrollView>

        {/* Modal */}
        <Modal visible={isModalVisible} transparent animationType="fade">
          <Pressable
            style={styles.modalOverlay}
            onPress={() => {
              setIsModalVisible(false);
              setSelectedHabitId(null);
            }}
          >
            <Pressable
              style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => {
                setIsModalVisible(false);
                setSelectedHabitId(null);
              }}
            >
              {/* Edit */}
              <Pressable
                onPress={() => {
                  if (!selectedHabitId) return;
                  startEditingHabit(selectedHabitId);
                }}
              >
                <Text style={[styles.modalItem, styles.modalItemBorder, { color: colors.text, borderBottomColor: colors.border }]}>
                  Edit
                </Text>
              </Pressable>

              {/* Toggle grid */}
              <Pressable
                onPress={() => {
                  if (!selectedHabitId) return;
                  toggleGridForHabit(selectedHabitId);
                  setIsModalVisible(false);
                  setSelectedHabitId(null);
                }}
              >
                <Text style={[styles.modalItem, styles.modalItemBorder, { color: colors.text, borderBottomColor: colors.border }]}>
                  {gridLabel}
                </Text>
              </Pressable>

              {/* Delete */}
              <Pressable
                onPress={() => {
                  if (!selectedHabitId) return;
                  deleteHabit(selectedHabitId);
                }}
              >
                <Text style={[styles.modalDelete, { color: colors.accent }]}>
                  Delete
                </Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  screen: {
    flex: 1,

    width: "100%",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  scroll: {
    flex: 1,
    width: "100%",

    padding: 12,
    paddingTop: 80,
  },
  scrollContent: {
    paddingBottom: 350,
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 4,
    marginTop: 16,
    marginBottom: 16,
  },

  editCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderWidth: 1,
    // borderTopRightRadius: 16,
    // borderBottomLeftRadius: 16,
    borderRadius: 10,

    paddingHorizontal: 16,
    height: 64,          // feels like your card height
    marginBottom: 12,
  },

  editInput: {
    flex: 1,
    fontSize: 20,
    paddingVertical: 0,  // keep it vertically centered
    paddingLeft: -2,
    marginRight: 12,

    includeFontPadding: false, // Android
    textAlignVertical: "center", // Android
  },

  editSubmitBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },


  resetBtn: {
    alignSelf: "flex-end",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  resetText: {
    fontSize: 14,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: 256, // w-64
    // borderTopRightRadius: 16,
    // borderBottomLeftRadius: 16,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  modalItem: {
    padding: 16,
    fontSize: 20,
  },
  modalItemBorder: {
    borderBottomWidth: 1,
  },
  modalDelete: {
    padding: 16,
    fontSize: 20,
    fontWeight: "600",
  },
});
