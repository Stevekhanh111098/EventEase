import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Auto-login if the user is already authenticated
      Alert.alert("Welcome back", `${user.displayName} is auto-logged in!`);
      router.push("/(tabs)/events");
    }
  });

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Login successful!");
      router.push("/(tabs)/events");
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, colorScheme === "dark" && styles.darkText]}>
        Login
      </Text>
      <TextInput
        style={[styles.input, colorScheme === "dark" && styles.darkInput]}
        placeholder="Email"
        placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#999"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, colorScheme === "dark" && styles.darkInput]}
        placeholder="Password"
        placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#999"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />

      {/* Forgot Password Link */}
      <TouchableOpacity onPress={() => router.push("/reset-password")}>
        <Text
          style={[
            styles.forgotPasswordText,
            colorScheme === "dark" && styles.darkLinkText,
          ]}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View style={styles.signupContainer}>
        <Text
          style={[styles.signupText, colorScheme === "dark" && styles.darkText]}
        >
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text
            style={[
              styles.linkText,
              colorScheme === "dark" && styles.darkLinkText,
            ]}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#000",
  },
  darkText: {
    color: "#000",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "#000",
  },
  darkInput: {
    borderColor: "#ccc",
    color: "#000",
  },
  signupText: {
    color: "#000",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  linkText: {
    marginLeft: 5,
    color: "blue",
  },
  darkLinkText: {
    color: "blue", // Ensure link text is visible in dark mode
  },
  forgotPasswordText: {
    marginTop: 10,
    color: "blue", // Match the link text color
    textAlign: "center", // Center the text
  },
});
