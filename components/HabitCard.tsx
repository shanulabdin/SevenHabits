import { colors } from "@/constants/colors";
import { useThemeColors } from "@/constants/theme";
import { hapticLight } from "@/utils/haptics";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ContributionGrid from "./ContributionGrid";

type HabitCardProps = {
  title: string;
  checked: boolean;
  streak: number;
  history: Record<string, boolean>;
  todayKey: string;
  showGrid: boolean;
  showStreak: boolean;
  markComplete: () => void;
  onLongPress: () => void;
};

export default function HabitCard({
  title,
  checked,
  streak,
  history,
  todayKey,
  showGrid,
  showStreak,
  markComplete,
  onLongPress,
}: HabitCardProps) {

  const { colors } = useThemeColors();

  return (
    <View style={styles.wrapper}>
      <Pressable
        onLongPress={onLongPress}
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
          showGrid ? null : styles.cardNoGrid,
        ]}
      >
        {/* LEFT SIDE */}
        <View style={[styles.left, showStreak ? styles.left : styles.noStreakLeft]}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              checked && styles.titleChecked,

            ]}
            numberOfLines={1}
          >
            {title}
          </Text>

          {showStreak && (
            <View style={styles.streak}>
              <Text style={[styles.streakText, { color: colors.text }]}>
                {streak}
              </Text>
              <Ionicons
                name="flame"
                color={colors.orange}
                size={18}
                style={{ transform: [{ translateY: 1 }] }}
              />
            </View>)
          }
        </View>

        {/* RIGHT SIDE */}
        <Pressable
          onPress={() => {
            hapticLight();
            markComplete();
          }}
          hitSlop={12}
          style={[
            styles.checkbox,
            checked && { backgroundColor: colors.orange, borderColor: colors.orange },

          ]}
        >
          {checked && (
            <Ionicons
              name="checkmark-sharp"
              size={23}
              color={colors.card}
            />
          )}
        </Pressable>
      </Pressable>

      {/* CONTRIBUTION GRID */}
      {showGrid && (
        <View style={[styles.gridBox, { backgroundColor: colors.card, borderColor: colors.border, borderTopWidth: 0 }]}>
          <ContributionGrid
            history={history}
            endDateKey={todayKey}
            weeks={19}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    alignItems: "center",
    width: "100%",
  },

  card: {
    flexDirection: "row",
    width: "100%",
    padding: 16,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  cardNoGrid: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    maxWidth: "75%",
  },
  noStreakLeft: {
    maxWidth: "100%",
  },

  title: {
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
  },

  titleChecked: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },

  streak: {
    flexDirection: "row",
    alignItems: "baseline",
    opacity: 0.8,
  },

  streakText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    marginRight: 2,
  },

  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    backgroundColor: "transparent",
    borderColor: colors.accent
  },

  gridBox: {
    width: "100%",
    padding: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
});
