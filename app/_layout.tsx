import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    primary: Colors.light.primary,
    card: Colors.light.surface,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.accent,
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    primary: Colors.dark.primary,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.accent,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme}
    >
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="events/addexpense"
          options={{ headerBackTitle: "Back", headerTitle: "" }}
        />
        <Stack.Screen
          name="events/addguest"
          options={{ headerBackTitle: "Back", headerTitle: "" }}
        />
        <Stack.Screen
          name="events/addtask"
          options={{ headerBackTitle: "Back", headerTitle: "" }}
        />
        <Stack.Screen
          name="events/addVendors"
          options={{ headerBackTitle: "Back", headerTitle: "" }}
        />
        <Stack.Screen
          name="events/createEvent"
          options={{ headerBackTitle: "Back", headerTitle: "" }}
        />
        <Stack.Screen
          name="events/eventdashboard"
          options={{ headerBackTitle: "Back", headerTitle: "" }}
        />
        <Stack.Screen
          name="events/rsvp"
          options={{ headerBackTitle: "Back", headerTitle: "" }}
        />
        <Stack.Screen
          name="events/selectVendor"
          options={{ headerBackTitle: "Back", headerTitle: "" }}
        />
        <Stack.Screen
          name="events/vendorDetail"
          options={{ headerBackTitle: "Back", headerTitle: "" }}
        />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
