import { useThemeColors } from '@/constants/theme';
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type HeadingProps = {
  title: string;
  iconTitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onIconPress?: () => void;
};

export default function Heading({
  title,
  iconTitle,
  icon,
  onIconPress,
}: HeadingProps) {
  const { colors } = useThemeColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.accent, fontFamily: "Poppins_600SemiBold" }]}>{title}</Text>

      {(icon || iconTitle) && (
        <Pressable
          disabled={!onIconPress}
          onPress={onIconPress}
          hitSlop={12}
          style={styles.iconRow}
        >
          {!!iconTitle && (
            <Text style={[styles.iconTitle, { color: colors.text, fontFamily: "Poppins_500Medium", }]}>
              {iconTitle}
            </Text>
          )}
          {!!icon && (
            <Ionicons name={icon} size={26} color={colors.text} />
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    // borderTopRightRadius: 16,
    // borderBottomLeftRadius: 16,
    // borderBottomRightRadius: 10,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginTop: 5,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconTitle: {
    marginRight: 8,
    marginTop: 5,
    fontSize: 14,
  },
});
