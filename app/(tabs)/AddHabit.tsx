import CreateHabit, { CreateHabitProps } from "@/components/CreateHabit";
import Heading from "@/components/Heading";
import { View } from "react-native";

export default function Tasks({ newHabitTitle, setNewHabitTitle, createHabit }: CreateHabitProps) {
  return (
    <View className="flex-1 items-center bg-colors-dark p-3 pt-20 w-full">
      <Heading />
      <CreateHabit newHabitTitle={newHabitTitle} setNewHabitTitle={setNewHabitTitle} createHabit={createHabit}/>
    </View>
  );
}
