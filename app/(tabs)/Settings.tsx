// app/(tabs)/settings.tsx  (or wherever your settings route lives)
import Heading from "@/components/Heading";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";

import { useThemeColors } from '@/constants/theme';
import { useHabits } from "@/src/context/HabitsProvider";
import { useConfirmModal } from "@/src/context/hooks/useConfirmModal";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as StoreReview from "expo-store-review";
import { SafeAreaView } from "react-native-safe-area-context";

type Item = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

// Helper Functions
const openUrl = async (url: string) => {
  const can = await Linking.canOpenURL(url);
  if (!can) return Alert.alert("Can't open link", url);
  await Linking.openURL(url);
};

const shareApp = async () => {
  const message = "Check out SevenHabits!";
  await Share.share({ message });
};

const rateApp = async () => {
  const available = await StoreReview.isAvailableAsync();
  if (available) {
    await StoreReview.requestReview();
  } else {
    // fallback: open store page if you have it
    Alert.alert("Rating not available on this device.");
  }
};

const sendFeedback = async () => {
  const to = "support@yourdomain.com"; // change
  const subject = encodeURIComponent("SevenHabits Feedback");
  const body = encodeURIComponent(
    `Hi,\n\nFeedback:\n\n\n---\nApp: SevenHabits\nVersion: ${Constants.expoConfig?.version ?? "unknown"}\n`
  );

  const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
  await openUrl(mailto);
};


// Components
function SettingsRow({ title, icon, onPress }: Item) {
  const { colors } = useThemeColors();
  return (
    <Pressable onPress={onPress} style={styles.row} android_ripple={{ color: "#2b2b2b" }}>
      <Text style={[styles.rowText, { color: colors.text }]}>{title}</Text>
      <Ionicons name={icon} size={18} color={colors.text} />
    </Pressable>
  );
}

function SettingsGroup({ items }: { items: Item[] }) {
  const { colors } = useThemeColors();
  return (
    <View style={styles.shadowWrapper}>
      <View style={[styles.group, { borderColor: colors.border, backgroundColor: colors.card }]}>
        {items.map((it, idx) => (
          <View key={it.title}>
            <SettingsRow {...it} />
            {idx !== items.length - 1 ? <View style={[styles.divider, { backgroundColor: colors.border }]} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}


export default function SettingsScreen() {
  const { colors } = useThemeColors();

  // Delete confirm hooks
  const { resetAllData } = useHabits();

  const {
    openConfirm: openDeleteConfirm,
    Confirm: DeleteConfirmModal,
  } = useConfirmModal({
    title: "Delete all data?",
    message:
      "This will permanently remove all habits and history.\nThis action cannot be undone.",
    confirmText: "Delete",
    countdownSeconds: 2,
    onConfirm: resetAllData,
    colors: {
      card: colors.card,
      border: colors.border,
      text: colors.text,
      mutedText: colors.mutedText,
      confirmBg: colors.orange,
      confirmText: "#fff",
    },
  });


  const top: Item[] = [
    { title: "Theme", icon: "color-palette-outline", onPress: () => router.push("/settings/theme") },
    { title: "General", icon: "grid-outline", onPress: () => router.push("/settings/general") },
    { title: "Widgets", icon: "cube-outline", onPress: () => router.push("/settings/widgets") },
  ];
  const cloud: Item[] = [
    { title: "Cloud Backup", icon: "cloud-outline", onPress: () => Alert.alert("Coming soon") },
    { title: "Import", icon: "download-outline", onPress: () => Alert.alert("Coming soon") },
    { title: "Export", icon: "share-outline", onPress: () => Alert.alert("Coming soon") },
  ];
  const misc: Item[] = [
    { title: "Share", icon: "share-social-outline", onPress: shareApp },
    { title: "Rate", icon: "star-outline", onPress: rateApp },
    { title: "Privacy Policy", icon: "document-text-outline", onPress: () => openUrl("https://yourdomain.com/privacy") },
    { title: "Terms & Conditions", icon: "document-outline", onPress: () => openUrl("https://yourdomain.com/terms") },
    { title: "Feedback", icon: "chatbubble-ellipses-outline", onPress: sendFeedback },
  ];
  const deleteData: Item[] = [
    { title: "Delete All Data", icon: "trash-outline", onPress: () => openDeleteConfirm() }
  ];


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.screen, { backgroundColor: colors.background }]} >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}

        >
          {/* Header */}
          <Heading title="Settings" iconTitle="" icon="settings" />

          {/* Groups */}
          <SettingsGroup items={top} />
          <SettingsGroup items={cloud} />
          <SettingsGroup items={misc} />

          {/* Reset button */}
          <SettingsGroup items={deleteData} />
        </ScrollView>
      </View>

      <View style={{ flex: 1 }}>
        <Pressable onPress={openDeleteConfirm}>
          <Text>Delete all data</Text>
        </Pressable>

        {DeleteConfirmModal}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 18,
  },
  shadowWrapper: {
    borderRadius: 10,
    backgroundColor: "transparent",

    // iOS
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // Android
    elevation: 3,
  },
  group: {
    borderWidth: 1,
    overflow: "hidden",
    borderRadius: 10,
  },
  row: {
    height: 46,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    opacity: 0.8,
  },
  divider: {
    height: 1,
    marginLeft: 14,
    marginRight: 14,
  },
  resetBtn: {
    height: 46,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resetText: {
    fontSize: 14,
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "85%",
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  modalText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
  },

  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },

  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },

});
