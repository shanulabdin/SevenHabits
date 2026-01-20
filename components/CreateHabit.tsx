import { colors } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Pressable, TextInput, View } from 'react-native';

export type CreateHabitProps = {
  setNewHabitTitle: React.Dispatch<React.SetStateAction<string>>;
  newHabitTitle: string;
  createHabit: (title: string) => void;
};

export default function CreateHabit({ newHabitTitle, setNewHabitTitle, createHabit }: CreateHabitProps) {

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
    <View className="
        w-full 
        flex-row 
        bg-colors-background 
        rounded-tr-2xl
        rounded-bl-2xl
        justify-between 
        mt-4
        px-4 py-1
      border-black border-[1px]
      " >
      <TextInput
        ref={inputRef}
        className="
          text-colors-text
          flex-1
        "
        placeholderTextColor={colors.orange}
        placeholder="Create Habit"
        onChangeText={setNewHabitTitle}
        value={newHabitTitle}
        returnKeyType="done"
        onSubmitEditing={() => createHabit(newHabitTitle)}
        maxLength={24}
        style={{ fontFamily: "Poppins_600SemiBold" }}
      />
      <Pressable
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        className="justify-center items-end"
        onPress={() => {
          createHabit(newHabitTitle);
        }}
      >
        <Ionicons
          name="add"
          size={26}
          color={colors.orange}
        />
      </Pressable>
    </View>
  );
}

