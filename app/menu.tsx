import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const HamburgerMenu = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuButton}>
      <View style={styles.menuIcon}>
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    backgroundColor: '#000',
  },
});

export default HamburgerMenu;