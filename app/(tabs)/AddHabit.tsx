import CreateHabit from "@/components/CreateHabit";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function AddHabit() {
  const [newHabitTitle, setNewHabitTitle] = useState("");

  function submit(title: string) {
    if (typeof title !== "string") {
      console.log("Not a string, ignoring submit");
      return;
    }

    const trimmed = title.trim();
    if (!trimmed) return;

    router.push({ pathname: "/", params: { newHabit: trimmed } });
    setNewHabitTitle("");
  }

  return (
    <View className="
      flex-1 
      items-center 
      bg-colors-dark 
      p-3 pt-20 
      w-full 
    ">
      <Heading
        title="Add Habit"
        iconTitle="Save"
        icon="checkmark"
        onIconPress={() => submit(newHabitTitle)} />
      <CreateHabit
        newHabitTitle={newHabitTitle}
        setNewHabitTitle={setNewHabitTitle}
        createHabit={submit}
      />
    </View>
  );
}
