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
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

// Required for web auth
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

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
    <View
      style={[styles.container, { backgroundColor: themedColors.background }]}
    >
      <Text style={[styles.title, { color: themedColors.primary }]}>Login</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: themedColors.border,
            color: themedColors.text,
            backgroundColor: themedColors.surface,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={themedColors.secondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          {
            borderColor: themedColors.border,
            color: themedColors.text,
            backgroundColor: themedColors.surface,
          },
        ]}
        placeholder="Password"
        placeholderTextColor={themedColors.secondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: themedColors.primary }]}
        onPress={handleLogin}
      >
        <Text
          style={[styles.loginButtonText, { color: themedColors.background }]}
        >
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.googleButton, { backgroundColor: themedColors.accent }]}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text
          style={[styles.googleButtonText, { color: themedColors.background }]}
        >
          Continue with Google
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/reset-password")}>
        <Text
          style={[styles.forgotPasswordText, { color: themedColors.primary }]}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={[styles.signupText, { color: themedColors.text }]}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={[styles.linkText, { color: themedColors.primary }]}>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    height: 40,
    width: "80%",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loginButton: {
    width: "80%",
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  loginButtonText: {
    fontWeight: "bold",
  },
  googleButton: {
    width: "50%",
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  googleButtonText: {
    fontWeight: "bold",
  },
  forgotPasswordText: {
    marginTop: 10,
    textAlign: "center",
  },
  signupText: {},
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  linkText: {
    marginLeft: 5,
  },
});
