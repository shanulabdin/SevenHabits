import { useThemeColors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { colors } = useThemeColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.dark
        },
        tabBarStyle: {
          backgroundColor: colors.dark,
          width: '100%',
          paddingBottom: 10,
          paddingTop: 10,
          marginTop: -23,
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.text,
      }}
    >
      <Tabs.Screen name="index" options={{
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name="home" size={focused ? size + 3 : size} color={color} />
        ),
      }} />
      <Tabs.Screen name="AddHabit" options={{
        title: "Weekly",
        tabBarIcon: ({ size, focused }) => (
          <Ionicons name="add-outline" className={`${focused ? 'bg-colors-orange' : 'bg-colors-text'} rounded color-transparent`} size={focused ? size + 3 : size} />
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