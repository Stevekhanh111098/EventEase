import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import HamburgerMenu from '../../components/HamburgerMenu'; // Import the HamburgerMenu component


export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../photo/background/blueTool.jpg')} // Ensure the path is correct
      style={styles.imageContainer}
      resizeMode="cover" // Use "cover" or "contain"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Hamburger Menu */}
          <HamburgerMenu onPress={() => router.push("/eventcreation")} />

          {/* User Profile Icon */}
          <TouchableOpacity onPress={() => router.push("/profolio")} style={styles.profileButton}>
            <Image
              source={require('../../photo/logo-color.png')}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to EventEase!</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Add a semi-transparent background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16, // Makes the image circular
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
