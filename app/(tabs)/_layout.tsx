import { useThemeColors } from "@/constants/theme";
import { hapticSelect } from "@/utils/haptics";
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
      <Tabs
        screenOptions={{
          headerShown: false,

          // ✅ haptics on ALL tab presses
          tabBarButton: (props) => <HapticTabButton {...props} />,

          tabBarStyle: {
            backgroundColor: colors.tabbar,
            width: "100%",
            height: 80,
            paddingBottom: 10,
            paddingTop: 12,
            marginTop: -23,
            borderTopWidth: 0, // Remove default top border
            
            // iOS shadow (top shadow)
            shadowColor: "#000",
            
            // stronger top shadow
            shadowOffset: { width: 0, height: -10 }, // increase negative height to raise the shadow
            shadowOpacity: 0.18,
            shadowRadius: 18,
            elevation: 5,
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
  );
}

const styles = StyleSheet.create({
  addBubble: {
    alignItems: "center",
    justifyContent: "center",
  },
});
