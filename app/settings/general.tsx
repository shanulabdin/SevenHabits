// app/settings/general.tsx
import Heading from "@/components/Heading";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

function Row({ title, right, onPress }: { title: string; right?: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between px-4 py-4"
      android_ripple={{ color: "#2b2b2b" }}
    >
      <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="text-colors-text">
        {title}
      </Text>
      <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="text-colors-text/70">
        {right ?? ">"}
      </Text>
    </Pressable>
  );
}

export default function GeneralScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.dark }}
      contentContainerStyle={{ padding: 12, paddingTop: 80, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Heading
        title="General"
        iconTitle="Back"
        icon="arrow-back"
        onIconPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
      />

      <View className="bg-colors-background border-black border-[1px] rounded-tr-2xl rounded-bl-2xl mt-4 overflow-hidden">
        <Text
          className="text-colors-text p-4 border-b-[1px] border-black"
          style={{ fontFamily: "Poppins_600SemiBold", fontSize: 16 }}
        >
          General Settings
        </Text>

        <Row title="Week starts on" right="Mon" onPress={() => Alert.alert("Coming soon")} />
        <View className="h-[1px] bg-black/40 mx-4" />

        <Row title="Haptics" right="On" onPress={() => Alert.alert("Coming soon")} />
        <View className="h-[1px] bg-black/40 mx-4" />

        <Row title="Reset all data" right="" onPress={() => Alert.alert("Later", "You’ll wire AsyncStorage reset here")} />
      </View>

      <Text className="text-colors-text/70 mt-3 text-xs" style={{ fontFamily: "Poppins_500Medium" }}>
        Keep these as placeholders until you connect logic.
      </Text>
    </ScrollView>
  );
}
