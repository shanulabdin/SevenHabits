import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#222222",
          borderTopWidth: 0,
          width: '100%',
          paddingBottom: 10,
          paddingTop: 10,
          marginTop: -23,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FF6D1F",
        tabBarInactiveTintColor: "#F5E7C6",
      }}
    >
      <Tabs.Screen name="index" options={{
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name="home" size={focused ? size + 3 : size} color={color} />
        ),
      }} />
      <Tabs.Screen name="Tasks" options={{
        title: "Tasks",
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name="checkbox" size={focused ? size + 3 : size} color={color} />
        ),
      }} />
      <Tabs.Screen name="AddHabit" options={{
        title: "Weekly",
        tabBarIcon: ({ size, focused }) => (
          <Ionicons name="add-outline" className={`${focused ? 'bg-colors-orange' : 'bg-colors-light'} rounded color-transparent`} size={focused ? size + 3 : size}  />
        ),
      }} />
      <Tabs.Screen name="Settings" options={{
        title: "Overall",
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name="settings" size={focused ? size + 3 : size} color={color} />
        ),
      }} />
    </Tabs>
  );
}