import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { View, StyleSheet } from "react-native";
import React from "react";

export default function ScreenContainer({
  children,
  insideTabs,
}: {
  children: React.ReactNode;
  insideTabs?: boolean;
}) {
  let tabBarHeight = 0;
  try {
    tabBarHeight = insideTabs ? useBottomTabBarHeight() || 0 : 0;
  } catch (error) {
    console.error("Error fetching tabBarHeight:", error);
  }

  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
