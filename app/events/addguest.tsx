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
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

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

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

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
    <View
      style={[styles.container, { backgroundColor: themedColors.background }]}
    >
      <Text style={[styles.title, { color: themedColors.primary }]}>
        Add Guest
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themedColors.surface,
            borderColor: themedColors.border,
            color: themedColors.text,
          },
        ]}
        placeholder="Guest Name"
        placeholderTextColor={themedColors.secondary}
        value={guest.name}
        onChangeText={(text) => setGuest((prev) => ({ ...prev, name: text }))}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themedColors.surface,
            borderColor: themedColors.border,
            color: themedColors.text,
          },
        ]}
        placeholder="Guest Email"
        placeholderTextColor={themedColors.secondary}
        value={guest.email}
        onChangeText={(text) => setGuest((prev) => ({ ...prev, email: text }))}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themedColors.surface,
            borderColor: themedColors.border,
            color: themedColors.text,
          },
        ]}
        placeholder="Meal Preference"
        placeholderTextColor={themedColors.secondary}
        value={guest.meal}
        onChangeText={(text) => setGuest((prev) => ({ ...prev, meal: text }))}
      />
      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, { color: themedColors.text }]}>
          VIP
        </Text>
        <Switch
          value={guest.vip}
          onValueChange={(value) =>
            setGuest((prev) => ({ ...prev, vip: value }))
          }
        />
      </View>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: themedColors.primary }]}
        onPress={handleAddGuest}
      >
        <Text style={[styles.buttonText, { color: themedColors.background }]}>
          Add Guest
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
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
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { fontWeight: "bold" },
});
