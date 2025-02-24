import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '@/firebase';
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      // Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Login successful!");
      router.push("/(tabs)/events"); // Navigate to home or dashboard
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}> 
      <Text style={[styles.title, colorScheme === 'dark' && styles.darkText]}>Login</Text>
      <TextInput
        style={[styles.input, colorScheme === 'dark' && styles.darkInput]}
        placeholder="Email"
        placeholderTextColor = {colorScheme === 'dark' ? "#ccc" : "#999"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, colorScheme === 'dark' && styles.darkInput]}
        placeholder="Password"
        placeholderTextColor = {colorScheme === 'dark' ? "#ccc" : "#999"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
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
  darkText: {
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
  signupText: {
    color: "#000", 
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
  darkLinkText: {
  },
});