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
  const { user, loading } = useAuth();

  console.log("User in TabsLayout:", user);
  console.log("Loading in TabsLayout:", loading);
  if (loading) return null;
  if (!user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
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
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
          default: {},
        }),
      })}
    >
      <Tabs.Screen name="events" options={{ title: "Events" }} />
      <Tabs.Screen name="vendors" options={{ title: "Vendors" }} />
      <Tabs.Screen name="invitations" options={{ title: "Invitations" }} />
    </Tabs>
  );
}
