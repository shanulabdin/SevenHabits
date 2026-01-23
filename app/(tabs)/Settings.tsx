// app/(tabs)/settings.tsx  (or wherever your settings route lives)
import Heading from "@/components/Heading";
import { colors } from "@/constants/colors"; // adjust if needed
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
    <View style={styles.group}  className="rounded-tr-2xl rounded-bl-2xl">
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
    { title: "Theme", icon: "color-palette-outline", onPress: () => { } },
    { title: "General", icon: "grid-outline", onPress: () => { } },
    { title: "Widgets", icon: "cube-outline", onPress: () => { } },
  ];

  const cloud: Item[] = [
    { title: "Cloud Backup", icon: "cloud-outline", onPress: () => { } },
    { title: "Import", icon: "download-outline", onPress: () => { } },
    { title: "Export", icon: "share-outline", onPress: () => { } },
  ];

  const misc: Item[] = [
    { title: "Share", icon: "share-social-outline", onPress: () => { } },
    { title: "Rate", icon: "star-outline", onPress: () => { } },
    { title: "Privacy Policy", icon: "document-text-outline", onPress: () => { } },
    { title: "Terms & Conditions", icon: "document-outline", onPress: () => { } },
    { title: "Feedback", icon: "chatbubble-ellipses-outline", onPress: () => { } },
  ];

  return (
    <View style={styles.screen} className="pt-20" >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Heading title="Settings" iconTitle="" icon="settings"  />

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
    backgroundColor: "black",

  },
  content: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 18,
  },

  group: {
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: "black",
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
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: "black",
    marginLeft: 14,
    marginRight: 14,
  },
});
