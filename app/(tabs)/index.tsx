import DayRing from '@/components/DayRing';
import HabitCard from '@/components/HabitCard';
import Heading from '@/components/Heading';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

function getDateKey(d = new Date()) {
  return d.toISOString().split("T")[0]; // "2026-01-20"
}

const todayLabel = new Date().toLocaleDateString(undefined, {
  day: "2-digit",
  month: "short",
});


export type Habit = {
  id: string;
  title: string;
  history: Record<string, boolean>;
};

export default function Index() {

  const todayKey = getDateKey();

  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Drink Water', history: { [todayKey]: false } },
    { id: '2', title: 'Exercise', history: { [todayKey]: true } },
    { id: '3', title: 'Read a Book', history: { [todayKey]: true } },
    { id: '4', title: 'Meditate', history: { [todayKey]: true } },
    { id: '5', title: 'Sleep Early', history: { [todayKey]: false } },
    { id: '6', title: 'Practice Gratitude', history: { [todayKey]: true } },
    { id: '7', title: 'Learn a New Skill', history: { [todayKey]: false } },
  ]);

  const totalCount = habits.length;

  const doneCount = habits.reduce((sum, habit) => {
    const doneToday = habit.history[todayKey] === true;
    return sum + (doneToday ? 1 : 0);
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

  const last7 = getLastNDays(7);

  const weekStats = last7.map(d => {
    const dateKey = getDateKey(d);
    return {
      key: dateKey,
      dayNumber: d.getDate().toString(), // "11"
      dayLabel: d.toLocaleDateString(undefined, { weekday: "short" }), // "Sun"
      percent: getPercentForDate(dateKey),
    };
  });



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

  function toggleHabit(id: string) {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id !== id) return habit;

        const current = habit.history[todayKey] === true;

        return {
          ...habit,
          history: {
            ...habit.history,
            [todayKey]: !current,
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
        [todayKey]: false,
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
            title={`Today, ${todayLabel}`}
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

              const checkedToday = habit.history[todayKey] === true;

              return (
                <HabitCard
                  key={habit.id}
                  title={habit.title}
                  checked={checkedToday}
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
            onPress={() => setIsModalVisible(false)}
          >
            <Pressable
              className="bg-colors-background rounded-xl w-64 border-black border-[1px]"
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
