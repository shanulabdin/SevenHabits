// app/settings/widgets.tsx
import Heading from "@/components/Heading";
import { useThemeColors } from "@/constants/theme";
import { hapticLight } from "@/utils/haptics";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function WidgetCard({
  title,
  desc,
  onPress,
}: {
  title: string;
  desc: string;
  onPress?: () => void;
}) {
  const { colors } = useThemeColors();
  return (
    <View style={styles.shadowWrapper}>
      <Pressable
        onPress={() => {
          hapticLight();
          onPress?.();
        }}
        // android_ripple={{ color: "#cfcfcfff", foreground: true }}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.desc, { color: colors.text, opacity: 0.7 }]}>
          {desc}
        </Text>
      </Pressable>
    </View>
  );
}



export default function WidgetsScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={[styles.scrollContent, { flex: 1, backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Heading
          title="Widgets"
          iconTitle="Back"
          icon="arrow-back"
          onIconPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
        />

        <View style={{
          gap: 12, marginTop: 16,

          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 3,
        }}>
          <WidgetCard
            title="Home Widget"
            desc="Show today’s progress and streaks on your home screen."
          />
          <WidgetCard
            title="Widget Style"
            desc="Choose compact / expanded layout and colors."
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 10,
    backgroundColor: "transparent",

    // iOS
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // Android
    elevation: 6,
  },
  scrollContent: {
    padding: 12,
    paddingTop: 10,
    paddingBottom: 24
  },
  card: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  title: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  desc: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    marginTop: 4,
  },
});