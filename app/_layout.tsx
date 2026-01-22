import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { View } from "react-native";
import "./globals.css";

import { colors } from "@/constants/colors";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";


const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.dark, // or colors.dark
    card: "#000000",
  },
};


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });



  if (!fontsLoaded) {
    return null; // or splash screen
  }
  return (
    <ThemeProvider value={MyDarkTheme}>
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#000000" } }} />
      </View>
    </ThemeProvider>
  );
}
