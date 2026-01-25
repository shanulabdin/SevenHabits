import { useThemeColors } from "@/constants/theme";
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
  const { colors } = useThemeColors();  
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
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
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
        placeholderTextColor={colors.text}
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
        <Ionicons name="add-sharp" size={32} color={colors.orange} />
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
    // borderTopRightRadius: 16,
    // borderBottomLeftRadius: 16,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingBottom: 12,
  },
  iconBtn: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginLeft: 8,
  },
});
