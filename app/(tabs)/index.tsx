import DayRing from '@/components/DayRing';
import HabitCard from '@/components/HabitCard';
import Heading from '@/components/Heading';
import { useHabits } from '@/src/context/HabitsProvider';
import { Habit } from '@/types/habit';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";

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
import { useConfirmModal } from '@/src/hooks/useConfirmModal';
import { getDateKey, getLastNDays } from '@/utils/date';
import { hapticHeavy, hapticLight, hapticSelect } from '@/utils/haptics';
import { getPercentForDate, getWeeklyPercent } from '@/utils/stats';
import { getHabitStreakWithGrace } from '@/utils/streaks';
import { Ionicons } from '@expo/vector-icons';


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

  const { habits, setHabits } = useHabits();

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
  }, [selectedDateKey, setHabits]);


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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const {
    openConfirm: openDeleteHabitConfirm,
    Confirm: DeleteHabitConfirmModal,
  } = useConfirmModal({
    title: "Delete this habit?",
    message:
      "This will permanently remove this habit and its history.",
    confirmText: "Delete",
    countdownSeconds: 0,
    onConfirm: () => {
      if (!selectedHabitId) return;
      deleteHabit(selectedHabitId);
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      <KeyboardAvoidingView
        style={[styles.kav, { flex: 1, backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.screen, { backgroundColor: colors.background, flex: 1 }]}>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 }]}
            keyboardShouldPersistTaps="handled"
            style={[styles.scroll, { flex: 1, backgroundColor: colors.background }]}
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
                  onPress={() => {
                    setSelectedDateKey(d.dateKey);
                    hapticLight();
                  }}
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
                      scrollRef.current?.scrollTo({ y: Math.max(0, y - 300), animated: true });
                    }}
                  >
                    <TextInput
                      value={editingHabitTitle}
                      onChangeText={setEditingHabitTitle}
                      autoFocus
                      returnKeyType="done"
                      maxLength={24}
                      onSubmitEditing={() => {
                        hapticLight();
                        saveEditingHabit(habit.id);
                      }}
                      onBlur={() => saveEditingHabit(habit.id)}
                      style={[
                        styles.editInput,
                        { color: colors.text, fontFamily: "Poppins_500Medium" },
                      ]}
                      placeholder="Edit habit"
                      placeholderTextColor={colors.text + "99"} // optional
                    />

                    <Pressable
                      onPress={() => {
                        hapticLight();
                        saveEditingHabit(habit.id)
                      }}
                      hitSlop={12}
                      style={[
                        styles.editSubmitBtn,
                      ]}
                    >
                      <Ionicons name="add-sharp" size={30} color={colors.orange} />
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
                    hapticSelect();
                    startEditingHabit(selectedHabitId);
                  }}
                >
                  <Text style={[styles.modalItem, styles.modalItemBorder, { color: colors.text, borderBottomColor: colors.border, fontFamily: "Poppins_500Medium" }]}>
                    Edit
                  </Text>
                </Pressable>

                {/* Toggle grid */}
                <Pressable
                  onPress={() => {
                    hapticSelect();
                    if (!selectedHabitId) return;
                    toggleGridForHabit(selectedHabitId);
                    setIsModalVisible(false);
                    setSelectedHabitId(null);
                  }}
                >
                  <Text style={[styles.modalItem, styles.modalItemBorder, { color: colors.text, borderBottomColor: colors.border, fontFamily: "Poppins_500Medium" }]}>
                    {gridLabel}
                  </Text>
                </Pressable>

                {/* Delete */}
                <Pressable
                  onPress={() => {
                    if (!selectedHabitId) return;
                    hapticHeavy();
                    openDeleteHabitConfirm();
                  }}
                >
                  <Text style={[styles.modalDelete, { color: colors.orange, fontFamily: "Poppins_500Medium" }]}>
                    Delete
                  </Text>
                </Pressable>
              </Pressable>
            </Pressable>
          </Modal>
        </View>
      </KeyboardAvoidingView>
      {DeleteHabitConfirmModal}
    </SafeAreaView>

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
  },
  scroll: {
    flex: 1,
    width: "100%",

    padding: 12,
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 0,
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

    // iOS
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // Android
    elevation: 3,
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
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 36
  },
  modalItemBorder: {
    borderBottomWidth: 1,
  },
  modalDelete: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    fontSize: 16,
    lineHeight: 36
  },
});
