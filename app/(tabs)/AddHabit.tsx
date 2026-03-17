import CreateHabit from "@/components/CreateHabit";
import Heading from "@/components/Heading";
import ReminderPicker from "@/components/ReminderPicker";
import { useThemeColors } from "@/constants/theme";
import type { Reminder } from "@/types/habit";
import { hapticLight } from "@/utils/haptics";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddHabit() {
  const { colors } = useThemeColors();
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [reminder, setReminder] = useState<Reminder | null>(null);

  function submit(title: string) {
    if (typeof title !== "string") {
      return;
    }

    const trimmed = title.trim();
    if (!trimmed) return;

    router.push({
      pathname: "/",
      params: {
        newHabit: trimmed,
        reminder: reminder ? JSON.stringify(reminder) : undefined,
      },
    });
    setNewHabitTitle("");
    setReminder(null);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Heading
          title="Add Habit"
          iconTitle="Save"
          icon="checkmark"
          onIconPress={() => {
            hapticLight();
            submit(newHabitTitle)
          }}
        />
        <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={false}>
          <CreateHabit
            newHabitTitle={newHabitTitle}
            setNewHabitTitle={setNewHabitTitle}
            createHabit={submit}
          />
          <ReminderPicker reminder={reminder} onChange={setReminder} />
        </ScrollView>
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
