import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#151515" },
        tabBarActiveTintColor: "#FF6D1F",
        tabBarInactiveTintColor: "#F5E7C6",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="days" options={{ title: "Weekly" }} />
      <Tabs.Screen name="grid" options={{ title: "Overall" }} />
    </Tabs>
  );
}