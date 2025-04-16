import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, useColorScheme, ImageBackground, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import CustomText from '../components/customText';

// Required for web auth
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false); // State for email input focus
  const [passwordFocused, setPasswordFocused] = useState(false); // State for password input focus
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '903802502171-d3j6obe2jidhjvhrsuoha7e2m7af0s8u.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: '903802502171-d3j6obe2jidhjvhrsuoha7e2m7af0s8u.apps.googleusercontent.com',
  });

  // Handle Google Sign-In response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          router.push("/(tabs)/events");
        })
        .catch((error) => {
          Alert.alert("Authentication Error", error.message);
        });
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/(tabs)/events");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../photo/blueBG.jpg")} // Add your background image here
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Login Icon */}
        <Image
          source={require("../photo/login-icon.png")} // Add your login icon here
          style={styles.loginIcon}
        />

        {/* Tagline */}
        <CustomText style={styles.tagline}>Your events, your way. Sign in to begin.</CustomText>

        <View style={{ width: "80%", alignItems: "center" }}>
          {/* Email Input */}
          <TextInput
            style={[
              styles.input,
              emailFocused && styles.inputFocused, // Apply focus style when focused
              colorScheme === "dark" && styles.darkInput,
            ]}
            placeholder="Email"
            placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#999"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setEmailFocused(true)} // Set focus state
            onBlur={() => setEmailFocused(false)} // Remove focus state
          />

          {/* Password Input */}
          <TextInput
            style={[
              styles.input,
              passwordFocused && styles.inputFocused, // Apply focus style when focused
              colorScheme === "dark" && styles.darkInput,
            ]}
            placeholder="Password"
            placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#999"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onFocus={() => setPasswordFocused(true)} // Set focus state
            onBlur={() => setPasswordFocused(false)} // Remove focus state
          />

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => router.push("/reset-password")}
            style={{ alignSelf: "flex-start" }} // Align to the left
          >
            <Text style={[styles.forgotPasswordText, colorScheme === "dark" && styles.darkLinkText]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Google Button */}
        <TouchableOpacity
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Image
            source={require("../photo/ggLogo.png")} // Path to your Google logo
            style={styles.googleLogo} // Style for the Google logo
          />
        </TouchableOpacity>

        {/* Sign Up Section */}
        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, colorScheme === 'dark' && styles.darkText]}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={[styles.linkText, colorScheme === 'dark' && styles.darkLinkText]}>Sign up</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
    alignItems: "center",
    backgroundColor: "transparent", // Make the container transparent to show the background
  },
  loginIcon: {
    width: 100, // Adjust the width of the icon
    height: 100, // Adjust the height of the icon
    marginBottom: 24, // Add spacing below the icon
  },
  tagline: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3B49DD",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    width: "110%",
    borderColor: "rgba(204, 204, 204, 0.88)", // Semi-transparent border
    borderWidth: 0.5,
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "#000",
    backgroundColor: "#fff", // Add a background color for better shadow visibility
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 2, height: 2 }, // Shadow offset to the bottom-right
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 5, // Shadow for Android
  },
  inputFocused: {
    borderColor: "#3B49DD", // Change border color when focused
    shadowColor: "#3B49DD", // Change shadow color when focused
    shadowOpacity: 0.5, // Increase shadow opacity when focused
    elevation: 8, // Increase elevation for Android
  },
  darkInput: {
    borderColor: "#ccc",
    color: "#000",
  },
  googleButton: {
    width: "30%",
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
  googleLogo: {
    width: 60, // Adjust the width of the logo
    height: 60, // Adjust the height of the logo
    resizeMode: "contain", // Ensure the logo maintains its aspect ratio
  },
  forgotPasswordText: {
    marginTop: 10,
    color: "#3B49DD",
    textAlign: "left", // Align text to the left
    width: "80%", // Match the width of the input fields
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  linkText: {
    marginLeft: 5,
    color: "blue",
  },
  darkText: {
    color: '#000',
  },
  darkLinkText: {
    color: "blue",
  },
  signupText: {
    color: "#000",
  },
  loginButton: {
    width: "70%",
    backgroundColor: "#1F90FF",
    padding: 10,
    borderRadius: 20,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 2, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 5, // Shadow for Android
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});