import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

type HeadingProps = {
  title: string,
  iconTitle: string,
  icon: keyof typeof Ionicons.glyphMap;
  onIconPress?: () => void;
}

export default function Heading({ title, iconTitle, icon, onIconPress }: HeadingProps) {
  return (
    <View className="
      w-full 
      bg-colors-dark 
      rounded-tr-2xl
      rounded-bl-2xl
      flex-row 
      justify-between 
      items-center 
      p-4 
      border-black border-[1px]"
    >
      <Text className="text-colors-text font-bold text-2xl">{title}</Text>
      
      {(icon || iconTitle) && (
        <Pressable
          disabled={!onIconPress}
          onPress={onIconPress}
          hitSlop={12}
          className="flex-row items-center"
        >
          {!!iconTitle && <Text className="text-colors-text mr-2 font-semibold">{iconTitle}</Text>}
          {!!icon && <Ionicons name={icon} size={26} color={colors.text} />}
        </Pressable>
      )}
    </View>
  );
}