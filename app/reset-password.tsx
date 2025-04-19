import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "expo-router";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      // Send a password reset email
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent. Check your inbox.");
      router.push("/login"); // Redirect to login screen after success
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../photo/background/blueBG.jpg")} // Add your background image here
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Reset Password</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Enter your email address, and we'll send you a link to reset your password.
        </Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Reset Password Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <Text style={styles.resetButtonText}>
            {isLoading ? "Sending..." : "Send Reset Email"}
          </Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent", // Transparent to show the background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3B49DD",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    width: "80%", // Match the width of the input fields
  },
  input: {
    height: 50,
    width: "80%",
    borderColor: "rgba(204, 204, 204, 0.88)", // Semi-transparent border
    borderWidth: 0.5,
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "#000",
    backgroundColor: "#fff", // Add a background color for better shadow visibility
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 2, height: 2 }, // Shadow offset to the bottom-right
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 5, // Shadow for Android
  },
  resetButton: {
    width: "70%",
    backgroundColor: "#1F90FF",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 2, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 5, // Shadow for Android
  },
  resetButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  backToLoginText: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
});