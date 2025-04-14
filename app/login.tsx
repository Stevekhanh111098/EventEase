import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, useColorScheme } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

// Required for web auth
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '903802502171-d3j6obe2jidhjvhrsuoha7e2m7af0s8u.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
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

  // Original email/password login (unchanged)
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
    <View style={styles.container}>
      <Text style={[styles.title, colorScheme === 'dark' && styles.darkText]}>Login</Text>
      
      {/* Original email/password form (unchanged) */}
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
        <Text style={[styles.forgotPasswordText, colorScheme === 'dark' && styles.darkLinkText]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={[styles.signupText, colorScheme === 'dark' && styles.darkText]}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={[styles.linkText, colorScheme === 'dark' && styles.darkLinkText]}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


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
  buttonDisabled: {
    opacity: 0.6,
  },
  forgotPasswordText: {
    marginTop: 10,
    color: "blue",
    textAlign: 'center',
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
});