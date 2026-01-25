import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export type CreateHabitProps = {
  setNewHabitTitle: React.Dispatch<React.SetStateAction<string>>;
  newHabitTitle: string;
  createHabit: (title: string) => void;
};

export default function CreateHabit({
  newHabitTitle,
  setNewHabitTitle,
  createHabit,
}: CreateHabitProps) {
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);

      return () => clearTimeout(timeout);
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            color: colors.text,
            fontFamily: "Poppins_600SemiBold",
          },
        ]}
        placeholder="Create Habit"
        placeholderTextColor={colors.accent}
        onChangeText={setNewHabitTitle}
        value={newHabitTitle}
        returnKeyType="done"
        onSubmitEditing={() => createHabit(newHabitTitle)}
        maxLength={24}
      />

      <Pressable
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={styles.iconBtn}
        onPress={() => createHabit(newHabitTitle)}
      >
        <Ionicons name="add" size={26} color={colors.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "black",
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  iconBtn: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginLeft: 8,
  },
});
