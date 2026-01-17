import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, Text } from "react-native";

type HabitCardProps = {
  title: string;
  checked: boolean;
  markComplete: () => void;
  onLongPress: () => void;
};

export default function HabitCard({ title, checked, markComplete, onLongPress }: HabitCardProps) {
  return (
    <Pressable className="
        flex-row 
        bg-colors-background 
        border-b-[1px]
        border-b-colors-light/20 
        w-full
        p-4 
        rounded-xl
        items-center
        justify-between
      "

        onLongPress={onLongPress}
      >
      <Text className={`
        text-colors-light 
        font-normal 
        text-2xl 
        max-w-[80%]
        ${checked ? 'line-through opacity-50' : ''} 
      `}>{title}</Text>

      <Pressable
        onPress={markComplete}
        hitSlop={12}

        className={`w-10 h-10 rounded-full items-center justify-center ${checked ? "bg-colors-orange" : "bg-colors-orange/30"
          }`}
      >
        <Ionicons name="checkmark-sharp" size={28} color={colors.dark} />
      </Pressable>
      
    </Pressable>
  );
}
