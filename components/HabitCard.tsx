import { colors } from "@/constants/colors";
import { useThemeColors } from "@/constants/theme";
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
          { backgroundColor: colors.card },
          showGrid ? null : styles.cardNoGrid,
        ]}
      >
        {/* LEFT SIDE */}
        <View style={styles.left}>
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

          <View style={styles.streak}>
            <Text style={[styles.streakText, { color: colors.text }]}>
              {streak}
            </Text>
            <Ionicons
              name="flame"
              color={colors.accent}
              size={18}
              style={{ transform: [{ translateY: 1 }] }}
            />
          </View>
        </View>

        {/* RIGHT SIDE */}
        <Pressable
          onPress={markComplete}
          hitSlop={12}
          style={[
            styles.checkbox,
            checked && { backgroundColor: colors.accent },
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
        <View style={[styles.gridBox, { backgroundColor: colors.card }]}>
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
    borderTopRightRadius: 16,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "black",
  },

  cardNoGrid: {
    borderBottomLeftRadius: 16,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    maxWidth: "75%",
  },

  title: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
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
    fontFamily: "Poppins_600SemiBold",
    marginRight: 2,
  },

  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.accent,
  },

  gridBox: {
    width: "100%",
    padding: 16,
    borderBottomLeftRadius: 16,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
  },
});
