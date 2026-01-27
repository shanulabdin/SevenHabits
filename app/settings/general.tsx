import Heading from "@/components/Heading";
import { useThemeColors } from "@/constants/theme";
import { useHabits } from "@/src/context/HabitsProvider";
import { useSettings } from "@/src/context/SettingsProvider";
import { useComingSoon } from "@/src/hooks/useComingSoon";
import { hapticLight } from "@/utils/haptics";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Row({
  title,
  right,
  onPress,
}: {
  title: string;
  right?: string;
  onPress?: () => void;
}) {
  const { colors } = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      style={styles.row}
    >
      <Text style={[styles.rowText, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.rowRight, { color: colors.text, opacity: 0.7 }]}>
        {right ?? ">"}
      </Text>
    </Pressable>
  );
}

export default function GeneralScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();

  const { ComingSoonModal } = useComingSoon();

  const { hapticsEnabled, toggleHaptics, isLoaded } = useSettings();

  // Show streaks and grid
  const { habits, setShowGridForAll, setShowStreakForAll } = useHabits();

  const showGridOn = habits.some(h => (h.showGrid ?? true) === true);
  const showStreakOn = habits.some(h => (h.showStreak ?? true) === true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Heading
          title="General"
          iconTitle="Back"
          icon="arrow-back"
          onIconPress={() =>
            router.canGoBack() ? router.back() : router.replace("/(tabs)")
          }
        />

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row
            title="Haptics"
            right={!isLoaded ? "..." : (hapticsEnabled ? "On" : "Off")}
            onPress={() => {
              // optional: give a “last” tap feedback only when currently on
              if (hapticsEnabled) hapticLight();
              toggleHaptics();
            }}
          />
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Row
            title="Show Grid"
            right={showGridOn ? "On" : "Off"}
            onPress={() => {
              hapticLight();
              setShowGridForAll(!showGridOn);
            }}
          />

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Row
            title="Show Streak"
            right={showStreakOn ? "On" : "Off"}
            onPress={() => {
              hapticLight();
              setShowStreakForAll(!showStreakOn);
            }}
          />
        </View>
      </ScrollView>
      {ComingSoonModal}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    // backgroundColor: "black",
  },
  scrollContent: {
    padding: 12,
    paddingTop: 10,
  },

  card: {
    marginTop: 16,
    borderWidth: 1,
    // borderColor: "black",
    // borderTopRightRadius: 16,
    // borderBottomLeftRadius: 16,
    borderRadius: 10,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  rowText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },

  rowRight: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },

  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});
