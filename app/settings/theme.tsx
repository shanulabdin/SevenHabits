import Heading from "@/components/Heading";
import { useThemeColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function ThemeScreen() {
  const router = useRouter();
  const { theme, setTheme, colors } = useThemeColors();

  const Row = ({ label, value }: { label: string; value: "dark" | "light" }) => (
    <Pressable
      onPress={() => setTheme(value)}
      className="flex-row items-center justify-between px-4 py-4"
      android_ripple={{ color: "#2b2b2b" }}
      style={{ backgroundColor: colors.background }}
    >
      <Text style={{ fontFamily: "Poppins_600SemiBold", color: colors.text }}>{label}</Text>
      {theme === value ? (
        <Ionicons name="radio-button-on-outline" style={{color: colors.orange }} size={20} ></Ionicons>
      ) : (
        <View />
      )}
    </Pressable>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.dark }}
      contentContainerStyle={{ padding: 12, paddingTop: 80, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Heading
        title="Theme"
        iconTitle="Back"
        icon="arrow-back"
        onIconPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
      />

      <View className="mt-4 border-black border-[1px] rounded-tr-2xl rounded-bl-2xl overflow-hidden">
        <Row label="Dark" value="dark" />
        <View className="h-[1px] bg-black mx-4" />
        <Row label="Light" value="light" />
      </View>
    </ScrollView>
  );
}
