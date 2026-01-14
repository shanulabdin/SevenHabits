import { colors } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, TextInput, View } from 'react-native';

type CreateHabitProps = {
  habits: { id: string; title: string; checked: boolean }[];
  setHabits: React.Dispatch<React.SetStateAction<{ id: string; title: string; checked: boolean }[]>>;
  setNewHabitTitle: React.Dispatch<React.SetStateAction<string>>;
  newHabitTitle: string;
};

export default function CreateHabit({ habits, setHabits, newHabitTitle, setNewHabitTitle }: CreateHabitProps) {
  return (
    <View className="w-full flex-row items-center justify-between bg-colors-background rounded-xl p-2 ">
      <TextInput
        className="
            placeholder:text-colors-orange
            text-colors-orange
            italic
            font-normal 
            text-2xl 
          "
        placeholder="Create Habit"
        onChangeText={setNewHabitTitle}
        value={newHabitTitle}
      />
      <Pressable
        onPress={() => {
          if (newHabitTitle.trim() === '') return;
          const newHabit = {
            id: habits.length + 1 + '',
            title: newHabitTitle,
            checked: false,
          };
          setHabits(prev => ([...prev, newHabit]));
          setNewHabitTitle('');
        }}
      >
        <Ionicons
          name="add"
          size={36}
          color={colors.orange}
          className=""
        />
      </Pressable>
    </View>
  );
}

