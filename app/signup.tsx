import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, useColorScheme } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Google Auth Request (same config as login)
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
    <View style={styles.container}>
      <Text style={[styles.title, colorScheme === 'dark' && styles.darkText]}>Sign Up</Text>
      
      <TextInput
        style={[styles.input, colorScheme === 'dark' && styles.darkInput]}
        placeholder="Email"
        placeholderTextColor={colorScheme === 'dark' ? "#ccc" : "#999"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={[styles.input, colorScheme === 'dark' && styles.darkInput]}
        placeholder="Password"
        placeholderTextColor={colorScheme === 'dark' ? "#ccc" : "#999"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={[styles.input, colorScheme === 'dark' && styles.darkInput]}
        placeholder="Confirm Password"
        placeholderTextColor={colorScheme === 'dark' ? "#ccc" : "#999"}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <Button title="Sign Up" onPress={handleSignup} />

      <TouchableOpacity
        style={[styles.googleButton]}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, colorScheme === 'dark' && styles.darkText]}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={[styles.linkText, colorScheme === 'dark' && styles.darkLinkText]}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Reuse the same styles from login.tsx or customize as needed
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#000',
  },
  darkInput: {
    borderColor: '#ccc',
    color: '#000',
  },
  googleButton: {
    width: '30%',
    backgroundColor: '#1f90ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  googleButtonText: {
    color: "white",
    fontWeight: 'bold',
  },
  loginContainer: {
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
  loginText: {
    color: "#000",
  },
});