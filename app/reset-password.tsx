import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent. Check your inbox.");
      router.push("/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themedColors.background }]}
    >
      <Text style={[styles.title, { color: themedColors.primary }]}>
        Reset Password
      </Text>
      <Text style={[styles.subtitle, { color: themedColors.secondary }]}>
        Enter your email address, and we'll send you a link to reset your
        password.
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: themedColors.border,
            color: themedColors.text,
            backgroundColor: themedColors.surface,
          },
        ]}
        placeholder="Enter your email"
        placeholderTextColor={themedColors.secondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: themedColors.primary }]}
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        <Text
          style={[styles.resetButtonText, { color: themedColors.background }]}
        >
          {isLoading ? "Sending..." : "Send Reset Email"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={[styles.backToLoginText, { color: themedColors.primary }]}>
          Back to Login
        </Text>
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
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  resetButton: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  resetButtonText: {
    fontWeight: "bold",
  },
  backToLoginText: {
    marginTop: 20,
    textAlign: "center",
  },
});
