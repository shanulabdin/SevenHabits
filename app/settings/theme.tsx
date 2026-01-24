// app/settings/theme.tsx
import Heading from "@/components/Heading";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

export default function ThemeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "black" }}
      contentContainerStyle={{ padding: 12, paddingTop: 80, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Heading
        title="Theme"
        iconTitle="Back"
        icon="arrow-back"
        onIconPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
      />

      <View className="bg-colors-dark border-black border-[1px] rounded-tr-2xl rounded-bl-2xl mt-4 overflow-hidden">

        {[
          { label: "Dark", value: "dark" },
          { label: "Light", value: "light" },
          { label: "System", value: "system" },
        ].map((t, idx, arr) => (
          <View key={t.value}>
            <Pressable
              onPress={() => Alert.alert("Coming soon", `Theme: ${t.label}`)}
              className="flex-row items-center justify-between px-4 py-4"
              android_ripple={{ color: "#2b2b2b" }}
            >
              <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="text-colors-text">
                {t.label}
              </Text>
              <Text className="text-colors-text/70" style={{ fontFamily: "Poppins_600SemiBold" }}>
                Select
              </Text>
            </Pressable>
            {idx !== arr.length - 1 ? <View className="h-[1px] bg-black/40 mx-4" /> : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
