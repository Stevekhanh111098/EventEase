import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, Platform, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Import Firestore
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default function CreateEventScreen() {
  const [step, setStep] = useState(1);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventLocation, setEventLocation] = useState("");
  const [eventBudget, setEventBudget] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (step === 1 && eventName.trim() === "") {
      Alert.alert("Error", "Event name is required.");
      return;
    }
    if (step === 2 && !eventDate) {
      Alert.alert("Error", "Event date is required.");
      return;
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

  const formatDateForFirestore = (date: Date) => {
    return moment(date).format('YYYY-MM-DD');
  };

  const handleCreateEvent = async () => {
    console.log('Create Event button clicked'); // Debugging log
    if (!eventBudget || isNaN(Number(eventBudget)) || Number(eventBudget) <= 0) {
      Alert.alert("Error", "Please enter a budget.");
      return;
    }
    try {
      console.log('Saving event to Firestore...');
      const docRef = await addDoc(collection(db, "events"), {
        name: eventName,
        date: formatDateForFirestore(eventDate),
        location: eventLocation,
        budget: eventBudget,
        createdAt: new Date(),
      });
      Alert.alert("Success", "Event created successfully!");
      console.log('Event successfully created with ID:', docRef.id);
      router.push("/events");
    } catch (error) {
      console.error("Firestore Error:", error);
      Alert.alert("Error", "Failed to create event. Try again.");
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || eventDate;
    setShowDatePicker(Platform.OS === 'ios');
    setEventDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Event (Step {step} of 4)</Text>

      {step === 1 && (
        <TextInput style={styles.input} placeholder="Event Name" value={eventName} onChangeText={setEventName} />
      )}

      {step === 2 && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Event Date (MM/DD/YYYY)"
            value={moment(eventDate).format('MM/DD/YYYY')}
            editable={false}
          />
          <Button title="Pick Date" onPress={() => setShowDatePicker(true)} />
          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
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
    backgroundColor: '#fff', // Always white background
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#000', // Always black text
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000', // Always black text
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
});
