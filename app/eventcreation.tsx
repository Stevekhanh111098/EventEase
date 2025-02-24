import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Import Firestore

export default function CreateEventScreen() {
  const [step, setStep] = useState(1);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventBudget, setEventBudget] = useState("");
  const router = useRouter();

  const handleNext = () => {
    if (step === 1 && eventName.trim() === "") {
      Alert.alert("Error", "Event name is required.");
      return;
    }
    if (step === 2) {
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!eventDate.match(dateRegex)) {
        Alert.alert("Error", "Please enter a valid date (MM/DD/YYYY).");
        return;
      }
    }
    if (step === 3 && eventLocation.trim() === "") {
      Alert.alert("Error", "Event location is required.");
      return;
    }
    if (step === 4 && (isNaN(Number(eventBudget)) || Number(eventBudget) <= 0)) {
      Alert.alert("Error", "Please enter a valid budget.");
      return;
    }
    setStep(step + 1);
  };

  const formatDateForFirestore = (date: string) => {
    const [month, day, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleCreateEvent = async () => {
    console.log('Create Event button clicked'); // Debugging log
    console.log('Create Event button clicked'); // Debugging log
    if (!eventBudget || isNaN(Number(eventBudget)) || Number(eventBudget) <= 0) {
      Alert.alert("Error", "Please enter a budget.");
      return;
    }
    if (!eventBudget || isNaN(Number(eventBudget)) || Number(eventBudget) <= 0) {
      Alert.alert("Error", "Please enter a budget.");
      return;
    }
    try {
      console.log('Saving event to Firestore...');
      console.log('Saving event to Firestore...');
      const docRef = await addDoc(collection(db, "events"), {
        name: eventName,
        date: formatDateForFirestore(eventDate),
        location: eventLocation,
        budget: eventBudget,
        createdAt: new Date(),
      });
      Alert.alert("Success", "Event created successfully!");
      console.log('Navigating to events list...');
      console.log('Event successfully created with ID:', docRef.id);
      console.log('Navigating to events list...');
      router.push("/events");
    } catch (error) {
      console.error("Firestore Error:", error);
      Alert.alert("Error", "Failed to create event. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Event (Step {step} of 4)</Text>

      {step === 1 && (
        <TextInput style={styles.input} placeholder="Event Name" value={eventName} onChangeText={setEventName} />
      )}

      {step === 2 && (
        <TextInput
          style={styles.input}
          placeholder="Event Date (MM/DD/YYYY)"
          value={eventDate}
          onChangeText={setEventDate}
        />
      )}

      {step === 3 && (
        <TextInput style={styles.input} placeholder="Event Location" value={eventLocation} onChangeText={setEventLocation} />
      )}

      {step === 4 && (
        <TextInput
          style={styles.input}
          placeholder="Event Budget ($)"
          keyboardType="numeric"
          value={eventBudget}
          onChangeText={setEventBudget}
        />
      )}

      <View style={styles.buttonContainer}>
        {step > 1 && <Button title="Back" onPress={() => setStep(step - 1)} />}
        {step < 4 ? (
          <Button title="Next" onPress={handleNext} />
        ) : (
          <Button title="Create Event" onPress={handleCreateEvent} />
        )}
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
});
