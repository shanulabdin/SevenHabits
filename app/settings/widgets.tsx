// app/settings/widgets.tsx
import Heading from "@/components/Heading";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
      android_ripple={{ color: "#2b2b2b" }}
      style={[styles.card, { backgroundColor: colors.card }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.desc, { color: colors.text, opacity: 0.7 }]}>
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

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "black",
    // borderTopRightRadius: 16,
    // borderBottomLeftRadius: 16,
    borderRadius: 10,
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  desc: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    marginTop: 4,
  },
});