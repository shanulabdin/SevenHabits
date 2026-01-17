import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

type HeadingProps = {
  title: string,
  iconTitle: string,
  icon: keyof typeof Ionicons.glyphMap;
}

export default function Heading({ title, iconTitle, icon }: HeadingProps) {
  return (
    <View className="w-full bg-colors-background rounded-xl flex-row justify-between items-center p-4 mb-10">
      <Text className="text-colors-text font-bold text-2xl">{title}</Text>
      <View className="flex-row">
        <Text className="text-colors-text mr-2 font-semibold">{iconTitle}</Text>
        <Ionicons name={icon} size={26} color={colors.text}></Ionicons>
      </View>
    </View>
  );
}