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
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";

// Required for web auth
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      Alert.alert("Welcome back", ` ${user.email}!`);
      router.replace("/(tabs)/events");
    }
  }, [user]);

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "903802502171-d3j6obe2jidhjvhrsuoha7e2m7af0s8u.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId:
      "903802502171-j51muuliu5j9ifr8dmn10f2ne0acavlp.apps.googleusercontent.com",
    webClientId:
      "903802502171-d3j6obe2jidhjvhrsuoha7e2m7af0s8u.apps.googleusercontent.com",
  });

  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          router.replace("/(tabs)/events");
        })
        .catch((error) => {
          Alert.alert("Authentication Error", error.message);
        });
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
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

      <TouchableOpacity
        style={[styles.googleButton]}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Rest of your original UI remains unchanged */}
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
  googleButton: {
    width: "50%",
    backgroundColor: "#1f90ff",
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  googleButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  forgotPasswordText: {
    marginTop: 10,
    color: "blue",
    textAlign: "center",
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
    color: "blue",
  },
});
