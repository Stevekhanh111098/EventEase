import React from "react";
import { View, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import CustomText from "../components/CustomText"; // Import CustomText

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 📸 70% Image Section */}
      <ImageBackground source={require("../photo/background/landing.jpg")} style={styles.imageContainer} resizeMode="cover">
        <View style={styles.overlay} />

        {/* Logo & App Name */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <CustomText style={styles.logoText}>E</CustomText>
          </View>
          <CustomText style={styles.logoTitle}>EventEase</CustomText>
        </View>

        {/* Welcome Message */}
        <CustomText style={styles.title}>Welcome to EventEase!</CustomText>
        <CustomText style={styles.subtitle}>
          Create, Organize, and Manage your Events with Ease.
        </CustomText>
      </ImageBackground>

      {/* Text Button */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => router.push("/login")} // Navigate to the login page
      >
        <CustomText style={styles.buttonText}>Let's plan smarter. Stress less.</CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 8, // 70% of the screen
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: -25,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Lighter overlay for a brighter background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -10,
    marginTop: -80, // Move the header up
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#A7E2E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2B2B2B",
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2B2B2B",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2B2B2B",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 20, // Move the title up
  },
  subtitle: {
    fontSize: 20,
    color: "#2B2B2B",
    textAlign: "center",
    paddingHorizontal: 20,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  arrowButton: {
    position: "absolute",
    bottom: 30, // Position near the bottom
    right: 30, // Position near the right edge
    backgroundColor: "#C1F0F0", // Light gray background for the box
    paddingVertical: 10, // Vertical padding inside the box
    paddingHorizontal: 15, // Horizontal padding inside the box
    borderRadius: 20, // Rounded corners for the box
    shadowColor: "#000", // Shadow for the box
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2B8D8D", // Blue color for the text
    textAlign: "center",
  },
});
