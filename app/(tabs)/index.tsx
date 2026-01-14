import HabitCard from '@/components/HabitCard';
import { View } from "react-native";

const habits = { id: '1', title: 'Drink Water', checked: false };

export default function Index() {

  return (
    <View
      className="flex-1 items-center bg-colors-dark p-4 "
    >
      <HabitCard key={habits.id} title={habits.title} />
    </View>
  );
}
