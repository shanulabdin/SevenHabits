// app/(tabs)/settings.tsx  (or wherever your settings route lives)
import Heading from "@/components/Heading";
import { Ionicons } from "@expo/vector-icons";
import { Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";

import { useThemeColors } from '@/constants/theme';
import { useHabits } from "@/src/context/HabitsProvider";
import { useComingSoon } from "@/src/hooks/useComingSoon";
import { useConfirmModal } from "@/src/hooks/useConfirmModal";
import { hapticError, hapticLight, hapticSelect } from "@/utils/haptics";
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
  if (!can) throw new Error("Cannot open URL: " + url);
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
    return;
  }

  const iosUrl = "itms-apps://itunes.apple.com/app/idYOUR_APP_ID?action=write-review";
  const androidUrl = "market://details?id=com.shanulabdin.Forge";

  const url = Platform.OS === "ios" ? iosUrl : androidUrl;
  await Linking.openURL(url);
};

const sendFeedback = async () => {
  const to = "support@yourdomain.com";
  const subject = encodeURIComponent("SevenHabits Feedback");
  const body = encodeURIComponent(
    `Hi,\n\nFeedback:\n\n\n---\nApp: SevenHabits\nVersion: ${Constants.expoConfig?.version ?? "unknown"}\n`
  );

  const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

  const can = await Linking.canOpenURL(mailto);
  if (!can) {
    // fallback: open a web contact page (replace)
    await openUrl("https://yourdomain.com/contact");
    return;
  }

  await Linking.openURL(mailto);
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

const withHaptic = (fn: () => void | Promise<void>, type: "light" | "select" = "light") =>
  async () => {
    if (type === "light") hapticLight();
    else hapticSelect();
    try {
      await fn();
    } catch (e) {
      hapticError?.(); // if you have it
      console.warn(e);
    }
  };

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
  });

  const { openComingSoon, ComingSoonModal } = useComingSoon();

  const top: Item[] = [
    {
      title: "Theme", icon: "color-palette-outline",
      onPress: withHaptic(() => router.push("/settings/theme"), "light"),
    },
    {
      title: "General", icon: "grid-outline",
      onPress: withHaptic(() => router.push("/settings/general"), "light"),
    },
    {
      title: "Widgets", icon: "cube-outline",
      onPress: withHaptic(() => router.push("/settings/widgets"), "light"),
    },
  ];
  const cloud: Item[] = [
    {
      title: "Cloud Backup", icon: "cloud-outline",
      onPress: withHaptic(() => openComingSoon(), "light"),
    },
    {
      title: "Import", icon: "download-outline",
      onPress: withHaptic(() => openComingSoon(), "light"),
    },
    {
      title: "Export", icon: "share-outline",
      onPress: withHaptic(() => openComingSoon(), "light"),
    },
  ];
  const misc: Item[] = [
    {
      title: "Share",
      icon: "share-social-outline",
      onPress: withHaptic(shareApp, "light"),
    },
    {
      title: "Rate",
      icon: "star-outline",
      onPress: withHaptic(rateApp, "light"),
    },
    {
      title: "Privacy Policy",
      icon: "document-text-outline",
      onPress: withHaptic(() => openUrl("https://yourdomain.com/privacy"), "light"),
    },
    {
      title: "Terms & Conditions",
      icon: "document-outline",
      onPress: withHaptic(() => openUrl("https://yourdomain.com/terms"), "light"),
    },
    {
      title: "Feedback",
      icon: "chatbubble-ellipses-outline",
      onPress: withHaptic(sendFeedback, "light"),
    },
  ];

  const deleteData: Item[] = [
    {
      title: "Delete All Data", icon: "trash-outline",
      onPress: withHaptic(() => openDeleteConfirm(), "light"),
    }
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
          {ComingSoonModal}

          {/* Reset button */}
          <SettingsGroup items={deleteData} />
          {DeleteConfirmModal}

        </ScrollView>
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
    fontFamily: "Poppins_500Medium",
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
  },

});
