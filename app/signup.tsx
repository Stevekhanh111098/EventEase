import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase"; // Import Firebase auth

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      // Create user with Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
      await signInWithEmailAndPassword(auth, email, password);
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
        placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#999'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, colorScheme === 'dark' && styles.darkInput]}
        placeholder="Password"
        placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#999'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <View style={styles.loginContainer}>
        <Text style={[styles.normalText, colorScheme === 'dark' && styles.darkText]}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={[styles.linkText, colorScheme === 'dark' && styles.darkLinkText]}>Login</Text>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#000', 
  },
  darkText: {
    color: '#000',
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000', 
  },
  darkInput: {
    borderColor: '#ccc', // Always light border
    color: '#000', // Always black text
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  normalText: {
    color: "#000", // Always black text
  },
  linkText: {
    marginLeft: 5,
    color: "blue",
  },
  darkLinkText: {
    color: "blue", // Always blue link text
  },
});
