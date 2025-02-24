import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 📸 70% Image Section */}
      <ImageBackground source={require("../logo/welcome_photo.jpg")} style={styles.imageContainer} resizeMode="cover">
        <View style={styles.overlay} />

        {/* Logo & App Name */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>E</Text>
          </View>
          <Text style={styles.logoTitle}>EventEase</Text>
        </View>

        {/* Welcome Message */}
        <Text style={styles.title}>Welcome to EventEase!</Text>
        <Text style={styles.subtitle}>
          Create, Organize, and Manage your Events with Ease.
        </Text>
      </ImageBackground>

      {/* 📌 30% Bottom Login Section with Curved Top */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/signup")}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Create an account</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Dark overlay for readability
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
    color: "#004D4D",
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#DDD",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  bottomContainer: {
    flex: 3, // 30% of the screen
    backgroundColor: "#E0F2F1",
    borderTopLeftRadius: 30, //  More pronounced curve
    borderTopRightRadius: 30, //  More pronounced curve
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
    shadowColor: "#000", // Soft shadow for elevation
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, //  Shadow for Android
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#E0E0E0",
  },
  secondaryButtonText: {
    color: "#333",
  },
});
