import HabitCard from '@/components/HabitCard';
import { View } from "react-native";

const habits = [
  { id: '1', title: 'Drink Water', checked: false },
  { id: '2', title: 'Exercise', checked: false },
  { id: '3', title: 'Read a Book', checked: false },
  { id: '4', title: 'Meditate', checked: false },
];

export default function Index() {

  return (
    <View
      className="flex-1 items-center bg-colors-dark p-4 pt-20 "
    >
      {
        habits.map(habit => (
          <HabitCard key={habit.id} title={habit.title} />
        ))
      }
    </View>
  );
}
