// app/(tabs)/settings.tsx  (or wherever your settings route lives)
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors"; // adjust if needed

type Item = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

function SettingsRow({ title, icon, onPress }: Item) {
  return (
    <Pressable onPress={onPress} style={styles.row} android_ripple={{ color: "#2b2b2b" }}>
      <Text style={styles.rowText}>{title}</Text>
      <Ionicons name={icon} size={18} color={colors.text} />
    </Pressable>
  );
}

function SettingsGroup({ items }: { items: Item[] }) {
  return (
    <View style={styles.group}>
      {items.map((it, idx) => (
        <View key={it.title}>
          <SettingsRow {...it} />
          {idx !== items.length - 1 ? <View style={styles.divider} /> : null}
        </View>
      ))}
    </View>
  );
}

export default function SettingsScreen() {
  const top: Item[] = [
    { title: "Theme", icon: "color-palette-outline", onPress: () => {} },
    { title: "General", icon: "grid-outline", onPress: () => {} },
    { title: "Widgets", icon: "cube-outline", onPress: () => {} },
  ];

  const cloud: Item[] = [
    { title: "Cloud Backup", icon: "cloud-outline", onPress: () => {} },
    { title: "Import", icon: "download-outline", onPress: () => {} },
    { title: "Export", icon: "share-outline", onPress: () => {} },
  ];

  const misc: Item[] = [
    { title: "Share", icon: "share-social-outline", onPress: () => {} },
    { title: "Rate", icon: "star-outline", onPress: () => {} },
    { title: "Privacy Policy", icon: "document-text-outline", onPress: () => {} },
    { title: "Terms & Conditions", icon: "document-outline", onPress: () => {} },
    { title: "Feedback", icon: "chatbubble-ellipses-outline", onPress: () => {} },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Pressable style={styles.headerIconBtn} onPress={() => {}}>
            <Ionicons name="settings-outline" size={18} color={colors.text} />
          </Pressable>
        </View>

        {/* Groups */}
        <SettingsGroup items={top} />
        <SettingsGroup items={cloud} />
        <SettingsGroup items={misc} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  content: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },

  headerCard: {
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#111",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  headerIconBtn: {
    height: 30,
    width: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  group: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#111",
    overflow: "hidden",
  },
  row: {
    height: 46,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  divider: {
    height: 1,
    backgroundColor: "#151515",
    marginLeft: 14,
    marginRight: 14,
  },
});
