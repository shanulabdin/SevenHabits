import { useThemeColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  streak: number;

  // Optional sizing tweaks
  numberSize?: number;
  iconSize?: number;

  style?: any;
};

export default function WidgetStreakCard({
  title,
  streak,
  numberSize = 35,
  iconSize = 40,
  style,
}: Props) {
  const { colors } = useThemeColors();

  return (
    <View style={styles.shadowWrapper}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        {/* Streak row */}
        <View style={styles.row}>
          <Text
            style={[
              styles.streakNumber,
              {
                fontSize: numberSize,
                color: colors.text,
              },
            ]}
          >
            {streak}
          </Text>

          <Ionicons
            name="flame"
            size={iconSize}
            color={colors.orange}
            style={{ marginLeft: 4, marginTop: 2, marginBottom: 4 }}
          />
        </View>

        {/* Title */}
        <Text
          style={[
            styles.title,
            { color: colors.muted },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 18,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },

    // Android shadow
    elevation: 2,

    marginBottom: 20,
    width: 200,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 218,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
  },
  streakNumber: {
    fontFamily: "Poppins_700Bold",
    lineHeight: 40,
  },
  title: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
});
