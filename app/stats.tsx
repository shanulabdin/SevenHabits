import Heading from "@/components/Heading";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Stats() {
  const router = useRouter();
  function onBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)"); // fallback only if needed
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.dark,
      padding: 12, paddingTop: 80,
      width: "100%",
    }} >
      <Heading
        title="Overall Stats"
        iconTitle="Back"
        icon="arrow-back"
        onIconPress={() => onBack()}
      />

    </View>
  );
}
