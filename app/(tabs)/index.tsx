import HabitCard from '@/components/HabitCard';
import Heading from '@/components/Heading';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

export type Habit = { id: string; title: string; checked: boolean };

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Drink Water', checked: false },
    { id: '2', title: 'Exercise', checked: true },
    { id: '3', title: 'Read a Book', checked: true },
    { id: '4', title: 'Meditate', checked: true },
    { id: '5', title: 'Sleep Early', checked: false },
    { id: '6', title: 'Practice Gratitude', checked: true },
    { id: '7', title: 'Learn a New Skill', checked: false },
  ]);

  // const [newHabitTitle, setNewHabitTitle] = useState('');

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
    setHabits(prev => prev.map(habit =>
      habit.id === id ? { ...habit, checked: !habit.checked } : habit)
    );
  }

  function createHabit(title: string) {
    if (title.trim() === '') return;
    const newHabit = {
      id: Date.now().toString(),
      title: title.trim(),
      checked: false,
    };
    setHabits(prev => ([...prev, newHabit]));
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

          <Heading title="Today, 17 Jan" iconTitle="78%" icon="pie-chart" />

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

              return (
                <HabitCard key={habit.id} title={habit.title} checked={habit.checked}
                  markComplete={() => toggleHabit(habit.id)}
                  onLongPress={longPressHabit(habit.id)}
                />
              );
            })
          }

        </ScrollView>

        <Modal visible={isModalVisible} transparent animationType="fade">
          <Pressable
            className="flex-1 bg-black/50 items-center justify-center"
            onPress={() => setIsModalVisible(false)}
          >
            <Pressable
              className="bg-colors-background rounded-xl w-64"
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
                <Text className="text-colors-text border-b-[1px] border-b-colors-light/20 p-4 text-xl">Edit</Text>
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
