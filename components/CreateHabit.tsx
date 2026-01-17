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
    <View className="
        w-full 
        flex-row 
        bg-colors-background 
        rounded-tr-2xl
        rounded-bl-2xl
        justify-between 
        px-4 py-1

      " >
      <TextInput
        className="
          text-colors-text
        "
        placeholderTextColor={colors.orange}
        placeholder="Create Habit"
        onChangeText={setNewHabitTitle}
        value={newHabitTitle}
        returnKeyType="done"
        onSubmitEditing={() => createHabit(newHabitTitle)}
        maxLength={24}
        style={{fontFamily: "Poppins_600SemiBold"}}
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

