import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function HabitCard() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View className="
        flex-row 
        mt-8 
        space-x-4 
        bg-colors-background 
        w-[100%] 
        p-4 
        rounded-xl
        items-center
        justify-between
        space-between
      ">
      <Text className="text-colors-light font-normal text-2xl">Code</Text>
      <Pressable
        onPress={() => {
          setIsChecked(!isChecked);
        }}
      >
        <Ionicons name={isChecked ? "checkbox" : "square-outline"} size={26} color={colors.light} />
      </Pressable>
    </View>
  );
}
