import HabitCard from '@/components/HabitCard';
import { View } from "react-native";

export default function Index() {

  return (
    <View
      className="flex-1 items-center bg-colors-dark p-4 "
    >
      <HabitCard></HabitCard>
    </View>
  );
}
