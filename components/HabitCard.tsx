import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type HabitCardProps = {
  title: string;
  checked: boolean;
  onToggle: () => void;
};

export default function HabitCard({ title, checked, onToggle }: HabitCardProps) {
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
      <Text className="text-colors-light font-normal text-2xl">{title}</Text>
      <Pressable
        onPress={() => {
          onToggle();
        }}
      >
        <Ionicons name={checked ? "checkbox" : "square-outline"} size={26} color={colors.light} />
      </Pressable>
    </View>
  );
}
