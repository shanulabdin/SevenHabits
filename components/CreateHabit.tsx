import { colors } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, TextInput, View } from 'react-native';

type CreateHabitProps = {
  setNewHabitTitle: React.Dispatch<React.SetStateAction<string>>;
  newHabitTitle: string;
  createHabit: (title: string) => void;
  onFocusInput: () => void;
};

export default function CreateHabit({ newHabitTitle, setNewHabitTitle, createHabit, onFocusInput }: CreateHabitProps) {
  return (
    <View className="w-full flex-row items-center justify-between bg-colors-background rounded-xl p-2 " >
      <TextInput
        className="
            flex-1
            italic
            font-normal 
            text-2xl 
            text-colors-orange
          "
        placeholderTextColor={colors.orange}
        placeholder="Create Habit"
        onChangeText={setNewHabitTitle}
        value={newHabitTitle}
        returnKeyType="done"
        onSubmitEditing={() => createHabit(newHabitTitle)}
        maxLength={30}
        onFocus={onFocusInput}
      />
      <Pressable
        className="w-16 h-14 justify-center items-end pr-1"
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

