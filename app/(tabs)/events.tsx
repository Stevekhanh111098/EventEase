import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Floating button icon

export default function EventsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
      <Text style={[styles.title, colorScheme === 'dark' && styles.darkText]}>Event List</Text>
      <Text style={[styles.subtitle, colorScheme === 'dark' && styles.darkText]}>Your created events will appear here.</Text>

      {/* Floating "Create Event" Button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/eventcreation")}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff', // Always white background
  },
  darkContainer: {
    backgroundColor: '#fff', // Always white background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#000', // Always black text
  },
  darkText: {
    color: '#000', // Always black text
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    color: "gray",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
