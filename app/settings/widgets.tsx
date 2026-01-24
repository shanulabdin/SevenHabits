// app/settings/widgets.tsx
import Heading from "@/components/Heading";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

function WidgetCard({
  title,
  desc,
  onPress,
}: {
  title: string;
  desc: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-colors-dark border-black border-[1px] rounded-tr-2xl rounded-bl-2xl p-4"
      android_ripple={{ color: "#2b2b2b" }}
    >
      <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 16 }} className="text-colors-text">
        {title}
      </Text>
      <Text style={{ fontFamily: "Poppins_500Medium" }} className="text-colors-text/70 mt-1 text-xs">
        {desc}
      </Text>
    </Pressable>
  );
}

export default function WidgetsScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "black" }}
      contentContainerStyle={{ padding: 12, paddingTop: 80, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Heading
        title="Widgets"
        iconTitle="Back"
        icon="arrow-back"
        onIconPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
      />

      <View style={{ gap: 12, marginTop: 16 }}>
        <WidgetCard
          title="Home Widget"
          desc="Show today’s progress and streaks on your home screen."
          onPress={() => Alert.alert("Coming soon")}
        />
        <WidgetCard
          title="Lock Screen Widget"
          desc="Quick view of weekly % and today’s habits."
          onPress={() => Alert.alert("Coming soon")}
        />
        <WidgetCard
          title="Widget Style"
          desc="Choose compact / expanded layout and colors."
          onPress={() => Alert.alert("Coming soon")}
        />
      </View>

    </ScrollView>
  );
}
