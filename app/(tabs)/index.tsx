import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* ✅ Horizontal Logo + Name Layout */}
      <View style={styles.logoRow}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>E</Text>
        </View>
        <Text style={styles.logoTitle}>EventEase</Text>
      </View>

      {/* 🎉 Welcome Message */}
      <Text style={styles.title}>Welcome to EventEase!</Text>
      <Text style={styles.subtitle}>Create, Organize, and Manage your Events with Ease.</Text>

      {/* 📌 Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.push("/signup")}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Go to Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F2F1", // ✅ Light Greenish Background
    paddingHorizontal: 20,
  },  
  logoRow: {
    flexDirection: "row", // ✅ Align logo and text horizontally
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#A7E2E2", // Light teal color
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10, // ✅ Add space between logo and text
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#004D4D", // Darker teal
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#004D4D", // ✅ Green/Teal color like the logo
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
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
