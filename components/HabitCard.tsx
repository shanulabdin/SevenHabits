import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import ContributionGrid from "./ContributionGrid";

type HabitCardProps = {
  title: string;
  checked: boolean;
  streak: number;
  history: Record<string, boolean>;
  todayKey: string;
  markComplete: () => void;
  onLongPress: () => void;
};

export default function HabitCard({
  title,
  checked,
  streak,
  // pending,
  history,
  todayKey,
  markComplete,
  onLongPress,
}: HabitCardProps) {
  return (
    <View className="mb-3">
      <Pressable
        className="
        flex-row 
        bg-colors-background 
        w-full
        p-4 
        rounded-tr-2xl
        rounded-bl-2xl
        items-center
        justify-between
        border-[1px]
        border-black
      "
        onLongPress={onLongPress}
      >
        {/* LEFT SIDE: Title + Streak */}
        <View className="flex-row items-center gap-4 max-w-[75%]">
          <Text
            style={{ fontFamily: "Poppins_600SemiBold" }}
            className={`
            text-colors-text 
            text-xl 
            ${checked ? "line-through text-colors-text/50" : ""}
          `}
            numberOfLines={1}
          >
            {title}
          </Text>

          <View className={`flex-row items-baseline opacity-80`}>
            <Text
              style={{ fontFamily: "Poppins_600SemiBold" }}
              className="text-colors-text text-xs"
            >
              {streak}
            </Text>
            <Ionicons
              name="flame"
              color={colors.orange}
              size={18}
              style={{ transform: [{ translateY: 1 }] }}
            />
          </View>
        </View>

        {/* RIGHT SIDE: Checkbox */}
        <Pressable
          onPress={markComplete}
          hitSlop={12}
          className={`
          w-8 h-8 rounded-full 
          items-center justify-center 
          border-[2px] border-colors-orange
          ${checked ? "bg-colors-orange" : ""}
        `}
        >
          {checked && (
            <Ionicons name="checkmark-sharp" size={23} color={colors.dark} />
          )}
        </Pressable>

      </Pressable>
      <View className="">
        <ContributionGrid history={history} endDateKey={todayKey} weeks={14} />
      </View>
    </View>
  );
}
