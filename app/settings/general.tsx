import Heading from "@/components/Heading";
import { useThemeColors } from "@/constants/theme";
import { useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
      android_ripple={{ color: "#2b2b2b" }}
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

  return (
    <ScrollView
      style={[styles.scroll, {backgroundColor: colors.background}]}
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
          title="Week starts on"
          right="Mon"
          onPress={() => Alert.alert("Coming soon")}
        />
        <View style={[styles.divider, {backgroundColor: colors.border}]} />

        <Row
          title="Haptics"
          right="On"
          onPress={() => Alert.alert("Coming soon")}
        />
        <View style={[styles.divider, {backgroundColor: colors.border}]} />

        <Row
          title="Reset all data"
          right=""
          onPress={() =>
            Alert.alert("Later", "You’ll wire AsyncStorage reset here")
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    // backgroundColor: "black",
  },
  scrollContent: {
    padding: 12,
    paddingTop: 80,
    paddingBottom: 24,
  },

  card: {
    marginTop: 16,
    borderWidth: 1,
    // borderColor: "black",
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

  rowRight: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },

  divider: {
    height: 1,
    backgroundColor: "green",
    marginHorizontal: 16,
  },
});
