import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function AddGuest() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [guest, setGuest] = useState({
    name: "",
    email: "",
    rsvp: "",
    meal: "",
    vip: false,
  });

  const handleAddGuest = async () => {
    if (!guest.name.trim() || !guest.email.trim()) {
      Alert.alert("Error", "Guest name and email are required.");
      return;
    }

    try {
      // Save guest data in the guestLists collection
      await addDoc(collection(db, "guestLists"), {
        eventId,
        ...guest,
        rsvp: "Pending",
      });

      Alert.alert("Success", "Guest added successfully.");
      router.back();
    } catch (error) {
      console.error("Failed to add guest:", error);
      Alert.alert("Error", "Failed to add guest.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Guest</Text>
      <TextInput
        style={styles.input}
        placeholder="Guest Name"
        value={guest.name}
        onChangeText={(text) => setGuest((prev) => ({ ...prev, name: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Guest Email"
        value={guest.email}
        onChangeText={(text) => setGuest((prev) => ({ ...prev, email: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Meal Preference"
        value={guest.meal}
        onChangeText={(text) => setGuest((prev) => ({ ...prev, meal: text }))}
      />
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>VIP</Text>
        <Switch
          value={guest.vip}
          onValueChange={(value) =>
            setGuest((prev) => ({ ...prev, vip: value }))
          }
        />
      </View>
      <TouchableOpacity onPress={handleAddGuest} style={styles.addButton}>
        <Text style={styles.buttonText}>Add Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  switchLabel: { fontSize: 16, marginRight: 10 },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
