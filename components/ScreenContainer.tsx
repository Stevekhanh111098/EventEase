import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import React from 'react';

export default function ScreenContainer({ children }: { children: React.ReactNode }) {
  const tabBarHeight = useBottomTabBarHeight();

  return <View style={[styles.container, { paddingBottom: tabBarHeight }]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
  },
});
