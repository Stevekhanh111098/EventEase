import React, { useState } from "react";
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as AuthSession from "expo-auth-session";
import { Colors } from "@/constants/Colors";

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

  // Google Auth Request (same config as login)
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "903802502171-d3j6obe2jidhjvhrsuoha7e2m7af0s8u.apps.googleusercontent.com",
    iosClientId:
      "903802502171-j51muuliu5j9ifr8dmn10f2ne0acavlp.apps.googleusercontent.com",
    webClientId:
      "903802502171-d3j6obe2jidhjvhrsuoha7e2m7af0s8u.apps.googleusercontent.com",
    // redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
  });

  // Log the redirect URI for debugging
  // console.log("Redirect URI:", AuthSession.makeRedirectUri({ useProxy: true }));

  // Handle Google Sign-In response
  React.useEffect(() => {
    if (response?.type === "success") {
      const id_token = response?.authentication?.idToken;
      if (id_token) {
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential)
          .then(() => {
            router.push("/(tabs)/events");
          })
          .catch((error) => {
            Alert.alert("Authentication Error", error.message);
          });
      } else {
        Alert.alert("Authentication Error", "No ID token received.");
      }
    }
  }, [response]);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/(tabs)/events");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themedColors.background }]}
    >
      <Text style={[styles.title, { color: themedColors.primary }]}>
        Sign Up
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
      <TextInput
        style={[
          styles.input,
          {
            borderColor: themedColors.border,
            color: themedColors.text,
            backgroundColor: themedColors.surface,
          },
        ]}
        placeholder="Confirm Password"
        placeholderTextColor={themedColors.secondary}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.signupButton, { backgroundColor: themedColors.primary }]}
        onPress={handleSignup}
      >
        <Text
          style={[styles.signupButtonText, { color: themedColors.background }]}
        >
          Sign Up
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
      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, { color: themedColors.text }]}>
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={[styles.linkText, { color: themedColors.primary }]}>
            Login
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
  signupButton: {
    width: "80%",
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  signupButtonText: {
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  linkText: {
    marginLeft: 5,
  },
  loginText: {},
});
