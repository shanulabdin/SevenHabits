import Heading from "@/components/Heading";
import { useThemeColors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ThemeScreen() {
  const router = useRouter();
  const { theme, setTheme, colors } = useThemeColors();

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value: "dark" | "light";
  }) => (
    <Pressable
      onPress={() => setTheme(value)}
      android_ripple={{ color: "#2b2b2b" }}
      style={[styles.row, { backgroundColor: colors.background }]}
    >
      <Text
        style={[
          styles.rowText,
          { color: colors.text },
        ]}
      >
        {label}
      </Text>

      {theme === value ? (
        <Ionicons
          name="radio-button-on-outline"
          size={20}
          color={colors.accent}
        />
      ) : (
        <View />
      )}
    </Pressable>
  );

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.card }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Heading
        title="Theme"
        iconTitle="Back"
        icon="arrow-back"
        onIconPress={() =>
          router.canGoBack() ? router.back() : router.replace("/(tabs)")
        }
      />

      <View style={styles.card}>
        <Row label="Dark" value="dark" />
        <View style={styles.divider} />
        <Row label="Light" value="light" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingTop: 80,
    paddingBottom: 24,
  },

  card: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "black",
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  rowText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },

  divider: {
    height: 1,
    backgroundColor: "black",
    marginHorizontal: 16,
  },
});
