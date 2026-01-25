import CreateHabit from "@/components/CreateHabit";
import Heading from "@/components/Heading";
import { colors } from "@/constants/colors";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

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
    <View style={[styles.container, { backgroundColor: colors.dark }]}>
      <Heading
        title="Add Habit"
        iconTitle="Save"
        icon="checkmark"
        onIconPress={() => submit(newHabitTitle)}
      />
      <CreateHabit
        newHabitTitle={newHabitTitle}
        setNewHabitTitle={setNewHabitTitle}
        createHabit={submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    paddingTop: 80,
    width: "100%",
  },
});
