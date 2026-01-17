import { colors } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, TextInput, View } from 'react-native';

export type CreateHabitProps = {
  setNewHabitTitle: React.Dispatch<React.SetStateAction<string>>;
  newHabitTitle: string;
  createHabit: (title: string) => void;
};

export default function CreateHabit({ newHabitTitle, setNewHabitTitle, createHabit }: CreateHabitProps) {
  return (
    <View className="w-full flex-row items-center justify-between bg-colors-background rounded-xl py-2 px-3" >
      <TextInput
        className="
          flex-1
          font-normal
          text-2xl
          text-colors-text
        "
        placeholderTextColor={colors.orange}
        placeholder="Create Habit"
        onChangeText={setNewHabitTitle}
        value={newHabitTitle}
        returnKeyType="done"
        onSubmitEditing={() => createHabit(newHabitTitle)}
        maxLength={30}
      />
      <Pressable
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        className="justify-center items-end pr-1"
        onPress={() => {
          createHabit(newHabitTitle);
        }}
      >
        <Ionicons
          name="add"
          size={32}
          color={colors.orange}
        />
      </Pressable>
    </View>
  );
}

