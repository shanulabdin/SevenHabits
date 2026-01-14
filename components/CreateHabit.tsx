import { colors } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, TextInput, View } from 'react-native';

type CreateHabitProps = {
  setNewHabitTitle: React.Dispatch<React.SetStateAction<string>>;
  newHabitTitle: string;
  createHabit: (title: string) => void;
};

export default function CreateHabit({ newHabitTitle, setNewHabitTitle, createHabit }: CreateHabitProps) {
  return (
    <View className="w-full flex-row items-center justify-between bg-colors-background rounded-xl p-2 ">
      <TextInput
        className="
            flex-1
            placeholder:text-colors-orange
            text-colors-orange
            italic
            font-normal 
            text-2xl 
          "
        placeholder="Create Habit"
        onChangeText={setNewHabitTitle}
        value={newHabitTitle}
        returnKeyType="done"
        onSubmitEditing={() => createHabit(newHabitTitle)}
      />
      <Pressable
        className="w-16 items-end pr-1"
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

