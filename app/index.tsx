import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

  return (
    <View style={styles.container}>
      {/* 📸 70% Image Section */}
      <ImageBackground
        source={require("../logo/welcome_photo.jpg")}
        style={styles.imageContainer}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Logo & App Name */}
        <View style={styles.header}>
          <View
            style={[
              styles.logoContainer,
              { backgroundColor: themedColors.secondary },
            ]}
          >
            <Text style={[styles.logoText, { color: themedColors.accent }]}>
              E
            </Text>
          </View>
          <Text style={[styles.logoTitle, { color: themedColors.background }]}>
            EventEase
          </Text>
        </View>

        {/* Welcome Message */}
        <Text style={[styles.title, { color: themedColors.background }]}>
          Welcome to EventEase!
        </Text>
        <Text style={[styles.subtitle, { color: themedColors.surface }]}>
          Create, Organize, and Manage your Events with Ease.
        </Text>
      </ImageBackground>

      {/* 📌 30% Bottom Login Section with Curved Top */}
      <View
        style={[
          styles.bottomContainer,
          { backgroundColor: themedColors.surface },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themedColors.primary }]}
          onPress={() => router.push("/login")}
        >
          <Text style={[styles.buttonText, { color: themedColors.background }]}>
            Get Started
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            { backgroundColor: themedColors.secondary },
          ]}
          onPress={() => router.push("/signup")}
        >
          <Text
            style={[
              styles.buttonText,
              styles.secondaryButtonText,
              { color: themedColors.accent },
            ]}
          >
            Create an account
          </Text>
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  bottomContainer: {
    flex: 3, // 30% of the screen
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
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {},
  secondaryButtonText: {},
});
