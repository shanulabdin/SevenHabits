import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#151515",
          borderTopWidth: 0,
          width: '100%',
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FF6D1F",
        tabBarInactiveTintColor: "#F5E7C6",
      }}
    >
      <Tabs.Screen name="index" options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }} />
      <Tabs.Screen name="tasks" options={{
        title: "Tasks",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="checkbox" size={size} color={color} />
        ),
      }} />
      <Tabs.Screen name="days" options={{
        title: "Weekly",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="pie-chart" size={size} color={color} />
        ),
      }} />
      <Tabs.Screen name="grid" options={{
        title: "Overall",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="grid" size={size} color={color} />
        ),
      }} />
    </Tabs>
  );
}