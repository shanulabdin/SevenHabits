import { useThemeColors } from "@/constants/theme";
import { HabitsProvider } from "@/src/context/HabitsProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {
  const { colors } = useThemeColors();

  return (
    <HabitsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.card },
          tabBarStyle: {
            backgroundColor: colors.card,
            width: "100%",
            paddingBottom: 10,
            paddingTop: 10,
            marginTop: -23,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            elevation: 0,           // ANDROID
            shadowColor: "transparent", // iOS
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name="home"
                size={focused ? size + 3 : size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="AddHabit"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <View
                style={[
                  styles.addBubble,
                  {
                    backgroundColor: focused ? colors.orange : colors.orange,
                    width: (focused ? size + 6 : size + 2) + 6,
                    height: (focused ? size + 6 : size + 2) + 6,
                    borderRadius: ((focused ? size + 6 : size + 2)) / 4,
                  },
                ]}
              >
                <Ionicons
                  name="add"
                  size={focused ? size + 3 : size}
                  color={colors.card}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="Settings"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name="settings"
                size={focused ? size + 3 : size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </HabitsProvider>
  );
}

const styles = StyleSheet.create({
  addBubble: {
    alignItems: "center",
    justifyContent: "center",
  },
});
