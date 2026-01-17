import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

export default function Heading() {
  return (
    <View className="w-full bg-colors-background rounded-xl flex-row justify-between items-center p-4 mb-10">
      <Text className="text-colors-text font-bold text-2xl">Today, 17 Jan</Text>
      <View className="flex-row">
        <Text className="text-colors-text mr-2 font-semibold">78%</Text>
        <Ionicons name="pie-chart" size={26} color={colors.text}></Ionicons>
      </View>
    </View>
  );
}