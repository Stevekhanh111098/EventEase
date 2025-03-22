import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';

const HamburgerMenu = ({ onPress }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <View style={styles.menuIcon}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </View>
      </TouchableOpacity>

      {/* Pop-up Menu */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.menuContainer}>
            {/* Menu Items */}
            <TouchableOpacity onPress={() => { onPress(); setIsMenuVisible(false); }} style={styles.menuItem}>
              <Text style={styles.menuText}>Create Event</Text>
            </TouchableOpacity>

            {/* Add more menu items here */}
          </View>
        </View>
      </Modal>
    </>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  menuContainer: {
    marginTop: 50, // Adjust the position of the menu
    marginLeft: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 4, // Adds a shadow (Android)
    shadowColor: '#000', // Adds a shadow (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuText: {
    fontSize: 16,
  },
});

export default HamburgerMenu;