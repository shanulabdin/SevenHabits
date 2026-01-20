import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, Text, View } from "react-native";

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
        w-full
        p-4 
        rounded-tr-2xl
        rounded-bl-2xl
        items-center
        justify-between
        mb-3
        border-[1px]
        border-black
      "

      onLongPress={onLongPress}
    >
      <View className={`flex-row items-baseline min-w-[48px] ${checked ? "" : "opacity-30"}`}>
        <Text style={{fontFamily: "Poppins_600SemiBold"}} className={`
        text-colors-text text-sm
        `}>130</Text>
        <Ionicons name="flame" color={colors.orange} size={20} style={{transform : [{translateY: 1}]}}></Ionicons>
      </View>

      <Text style={{fontFamily: "Poppins_600SemiBold"}} className={`
        text-colors-text 
        font-semibold 
        text-xl 
        text-center
        max-w-[60%]
        ${checked ? "line-through text-colors-text/50" : ""}
      `}>{title}</Text>


      <Pressable
        onPress={markComplete}
        hitSlop={12}

        className={`w-8 h-8 rounded-full items-center justify-center`}
        >
        {/* ${checked ? "bg-colors-orange" : ""} */}

        <Ionicons name={`${checked ? "ellipse" : "ellipse-outline"}`} size={28} color={colors.orange} />
      </Pressable>

    </Pressable>
  );
}
