import { useThemeColors } from "@/constants/theme";
import { HabitsProvider } from "@/src/context/HabitsProvider";
import { hapticSelect } from "@/utils/haptics"; // <- adjust path if yours is different
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

function HapticTabButton(props: any) {
  const { onPress, ...rest } = props;

  return (
    <Pressable
      {...rest}
      onPress={(e) => {
        hapticSelect();
        onPress?.(e);
      }}
    />
  );
}

export default function TabLayout() {
  const { colors } = useThemeColors();

  return (
    <HabitsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.card },

          // ✅ haptics on ALL tab presses
          tabBarButton: (props) => <HapticTabButton {...props} />,

          tabBarStyle: {
            backgroundColor: colors.card,
            width: "100%",
            paddingBottom: 10,
            paddingTop: 10,
            marginTop: -23,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            elevation: 0, // ANDROID
            shadowColor: "transparent", // iOS
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.orange,
          tabBarInactiveTintColor: colors.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
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
                    backgroundColor: (focused ? colors.orange : colors.card),
                    borderWidth: 1,
                    borderColor: (focused ? colors.orange : colors.text),
                    width: (focused ? size + 3 : size + 2) + 6,
                    height: (focused ? size + 3 : size + 2) + 6,
                    borderRadius: (focused ? size + 6 : size + 2) / 4,
                  },
                ]}
              >
                <Ionicons
                  name={focused ? "add" : "add-outline"}
                  size={focused ? size + 3 : size}
                  color={(focused ? colors.card : colors.text)}
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
                name={focused ? "settings" : "settings-outline"}
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
