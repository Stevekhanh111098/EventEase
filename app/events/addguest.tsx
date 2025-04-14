import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function AddGuest() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [guest, setGuest] = useState({
    name: "",
    rsvp: "",
    meal: "",
    vip: false,
  });

  const handleAddGuest = async () => {
    if (!guest.name.trim()) {
      Alert.alert("Error", "Guest name is required.");
      return;
    }

    try {
      const eventRef = doc(db, "events", eventId);
      const eventSnapshot = await getDoc(eventRef);
      const eventData = eventSnapshot.data();

      if (!eventData) {
        Alert.alert("Error", "Event not found.");
        return;
      }

      const updatedGuestList = [...(eventData.guestList || []), guest];

      await updateDoc(eventRef, { guestList: updatedGuestList });
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
        placeholder="RSVP (Yes/No/Maybe)"
        value={guest.rsvp}
        onChangeText={(text) => setGuest((prev) => ({ ...prev, rsvp: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Meal Preference"
        value={guest.meal}
        onChangeText={(text) => setGuest((prev) => ({ ...prev, meal: text }))}
      />
      <TouchableOpacity
        onPress={() => setGuest((prev) => ({ ...prev, vip: !prev.vip }))}
        style={styles.vipButton}
      >
        <Text style={styles.buttonText}>
          {guest.vip ? "Mark as Regular" : "Mark as VIP"}
        </Text>
      </TouchableOpacity>
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
  vipButton: {
    backgroundColor: "#FF9500",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
