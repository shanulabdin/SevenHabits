import HabitCard from '@/components/HabitCard';
import { useState } from 'react';
import { View } from "react-native";


export default function Index() {
  const [habits, setHabits] = useState([
    { id: '1', title: 'Drink Water', checked: false },
    { id: '2', title: 'Exercise', checked: true },
    { id: '3', title: 'Read a Book', checked: true },
    { id: '4', title: 'Meditate', checked: true },
    { id: '5', title: 'Sleep Early', checked: false },
    { id: '6', title: 'Practice Gratitude', checked: true },
    { id: '7', title: 'Learn a New Skill', checked: false },
  ]);

  function toggleHabit(id: string) {
    setHabits(prev => prev.map(habit =>
        habit.id === id ? { ...habit, checked: !habit.checked } : habit
      )
    );
  }

  return (
    <View
      className="flex-1 items-center bg-colors-dark p-4 pt-20 "
    >
      {
        habits.map(habit => (
          <HabitCard key={habit.id} title={habit.title} checked={habit.checked} markComplete={() => toggleHabit(habit.id)} />
        ))
      }
    </View>
  );
}
