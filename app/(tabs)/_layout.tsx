import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/hooks/useAuth";
import { Redirect, Stack } from "expo-router";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];
  const { user, loading } = useAuth();

  console.log("User in TabsLayout:", user);
  console.log("Loading in TabsLayout:", loading);
  if (loading) return null;
  if (!user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: themedColors.primary,
        tabBarInactiveTintColor: themedColors.icon,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: themedColors.surface,
          borderTopColor: themedColors.border,
          ...Platform.select({ ios: { position: "absolute" }, default: {} }),
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "index":
              iconName = focused ? "home" : "home-outline";
              break;
            case "events":
              iconName = focused ? "calendar" : "calendar-outline";
              break;
            case "vendors":
              iconName = focused ? "storefront" : "storefront-outline";
              break;
            case "invitations":
              iconName = focused ? "document" : "document-outline";
              break;
            default:
              iconName = "help-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="events" options={{ title: "Events" }} />
      <Tabs.Screen name="vendors" options={{ title: "Vendors" }} />
      <Tabs.Screen name="invitations" options={{ title: "Invitations" }} />
    </Tabs>
  );
}
