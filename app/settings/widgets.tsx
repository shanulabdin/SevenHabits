// app/settings/widgets.tsx
import Heading from "@/components/Heading";
import { useThemeColors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getDateKey } from '@/utils/date';
import { GridWidget } from "@/widget/GraphWidget";
import { ScoreWidget } from "@/widget/ScoreWidget";
import { StreakWidget } from "@/widget/StreakWidget";
import { ColorProp, WidgetPreview } from "react-native-android-widget";

export default function WidgetsScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();

  const todayKey = getDateKey();

  function generateFakeHistory(days = 98) {
    const history: Record<string, boolean> = {};
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);

      const baseChance = 0.7;
      const streakBonus = Math.min(streak * 0.03, 0.2);
      const done = Math.random() < baseChance + streakBonus;

      history[key] = done;
      streak = done ? streak + 1 : 0;
    }

    return history;
  }


  const fakeHistory = generateFakeHistory(98);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.scrollContent,
          { alignItems: "center", justifyContent: "center", flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
      >

        <View style={{ width: "100%", alignItems: "center", marginBottom: 10 }}>
          <Heading
            title="Widgets"
            iconTitle="Back"
            icon="arrow-back"
            onIconPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
          />
        </View>

        <Text style={[styles.widgetTitle, { color: colors.text }]}>Score Widget</Text>
        <View
          style={[
            styles.widgetContainer,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
        >
          <WidgetPreview
            renderWidget={() => (
              <ScoreWidget
                title="Forge"
                percent={80}
                bg={colors.card as ColorProp}
                text={colors.text as ColorProp}
                muted={colors.muted as ColorProp}
              />
            )}
            width={200}
            height={200}
          />
        </View>
        <Text style={[styles.desc, { color: colors.muted }]}>
          Displays your monthly completion score (%) for the first habit.
        </Text>

        <Text style={[styles.widgetTitle, { color: colors.text }]}>Streak Widget</Text>
        <View
          style={[
            styles.widgetContainer,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
        >
          <WidgetPreview
            renderWidget={() => (
              <StreakWidget
                title="Forge"
                streak={12}
                bg={colors.card as ColorProp}
                text={colors.text as ColorProp}
                muted={colors.muted as ColorProp}
              />
            )}
            width={200}
            height={200}
          />
        </View>
        <Text style={[styles.desc, { color: colors.muted }]}>
          Shows your current streak for the first habit in your list.
        </Text>

        <Text style={[styles.widgetTitle, { color: colors.text }]}>Streak Widget</Text>
        <View
          style={[
            styles.widgetContainer,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
        >
          <WidgetPreview
            renderWidget={() => (
              <GridWidget
                history={fakeHistory ? fakeHistory : {}}
                endDateKey={todayKey}
                bg={colors.card as ColorProp}
                orange={colors.orange as ColorProp}
                muted={colors.accentMuted as ColorProp}
              />
            )}
            width={365}
            height={200}
          />
        </View>
        <Text style={[styles.desc, { color: colors.muted }]}>
          Visualizes your habit consistency with a contribution graph.
        </Text>

        <View style={[styles.howToBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.howToTitle, { color: colors.text }]}>Add widgets to your home screen</Text>

          <Text style={[styles.howToText, { color: colors.muted }]}>
            1. Long press an empty spot on your home screen{"\n"}
          </Text>
          <Text style={[styles.howToText, { color: colors.muted }]}>
            2. Tap Widgets{"\n"}
          </Text>
          <Text style={[styles.howToText, { color: colors.muted }]}>
            3. Find Forge{"\n"}
          </Text>
          <Text style={[styles.howToText, { color: colors.muted }]}>
            4. Choose a widget and drag it onto your home screen{"\n"}
          </Text>
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
    paddingBottom: 24,
  },
  widgetTitle: {
    fontSize: 20,
    opacity: 0.75,
    marginHorizontal: 10,
    marginTop: 10,
    width: 200,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  desc: {
    fontSize: 13,
    opacity: 0.75,
    marginTop: 0,
    marginBottom: 14,
    marginHorizontal: 10,
    width: 280,
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "80%",
    marginBottom: 10,
  },
  streak: {
    flexDirection: "row",
    alignItems: "baseline",
    opacity: 0.8,
  },

  streakText: {
    fontSize: 35,
    marginRight: 2,
  },
  habitTitle: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  widgetContainer: {
    elevation: 3,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 10,
  },
  howToBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    paddingBottom: 5,
    marginTop: 8,
    marginBottom: 30,

    elevation: 2,

    width: 360,
  },
  howToTitle: {
    fontSize: 20,
    opacity: 0.75,
    marginBottom: 15,
    marginHorizontal: 10,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  howToText: {
    fontSize: 13,
    opacity: 0.75,
    marginHorizontal: 10,
    fontFamily: "Poppins_500Medium",
  },
});