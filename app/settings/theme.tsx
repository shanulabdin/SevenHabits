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
import { SafeAreaView } from "react-native-safe-area-context";

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
      style={[styles.row, { backgroundColor: colors.card }]}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
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

        <View style={[styles.card, { borderColor: colors.border }]}>
          <Row label="Dark" value="dark" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row label="Light" value="light" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingTop: 10,
  },

  card: {
    marginTop: 16,
    borderWidth: 1,
    // borderTopRightRadius: 16,
    // borderBottomLeftRadius: 16,
    borderRadius: 10,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.35,
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

  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});
