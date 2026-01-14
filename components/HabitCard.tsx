import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type HabitCardProps = {
  title: string;
  checked: boolean;
  markComplete: () => void;
};

export default function HabitCard({ title, checked, markComplete }: HabitCardProps) {
  return (
    <View className="
        flex-row 
        mb-4 
        bg-colors-background 
        w-full
        p-4 
        rounded-xl
        items-center
        justify-between
      ">
      <Text className={`
        text-colors-light 
        font-normal 
        text-2xl 
        ${checked ? 'line-through opacity-50' : ''} 
      `}>{title}</Text>
      <Pressable
        onPress={() => {
          markComplete();
        }}
      >
        <Ionicons name={checked ? "checkbox" : "square-outline"} size={26} color={colors.light} />
      </Pressable>
    </View>
  );
}
