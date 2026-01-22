import Heading from "@/components/Heading";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Stats() {
  const router = useRouter();
  function onBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)"); // fallback only if needed
  }

  return (
    <View className="flex-1 bg-colors-dark  p-3 pt-20 w-full" >
      <Heading
        title="Overall Stats"
        iconTitle="Back"
        icon="arrow-back"
        onIconPress={() => onBack()}
      />
    </View>
  );
}
