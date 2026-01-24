import { DarkTheme, ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { View } from "react-native";
import { ThemeProvider, useThemeColors } from "../constants/theme";

function AppStack() {
  const { colors, isLoaded } = useThemeColors();

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  const navTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "black",
      card: colors.dark,
      text: colors.text,
    },
  };

  return (
    <NavThemeProvider value={navTheme}>
      <View style={{ flex: 1, backgroundColor: colors.dark }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "black" },
            animation: "slide_from_right",
          }}
        />
      </View>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppStack />
    </ThemeProvider>
  );
}
