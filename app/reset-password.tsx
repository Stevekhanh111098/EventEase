import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity, // Add this import
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase"; // Import Firebase auth
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
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address, and we'll send you a link to reset your password.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button
        title={isLoading ? "Sending..." : "Send Reset Email"}
        onPress={handleResetPassword}
        disabled={isLoading}
      />
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  backToLoginText: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
});