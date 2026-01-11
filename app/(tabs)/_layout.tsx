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
          height: 90,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarIconStyle: { 
          marginTop: 5,
          

        },
        tabBarLabelStyle: { 
          fontSize: 14, 
          marginBottom: 5 
        },
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