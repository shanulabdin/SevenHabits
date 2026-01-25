import CreateHabit from "@/components/CreateHabit";
import Heading from "@/components/Heading";
import { useThemeColors } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddHabit() {
  const { colors } = useThemeColors();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    paddingTop: 10,
    width: "100%",
  },
});
