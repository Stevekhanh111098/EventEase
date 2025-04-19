import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, Platform, SafeAreaView, ScrollView, TouchableOpacity, Switch, ImageBackground } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "expo-router";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

export default function CreateEventScreen() {
  return (
    <ImageBackground
      source={{ uri: "https://via.placeholder.com/1080x1920" }} // Set the background image
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Create New Event</Text>
          </View>
          <EventForm />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [eventLocation, setEventLocation] = useState("");
  const [eventBudget, setEventBudget] = useState("");
  const [description, setDescription] = useState("");
  const [hostedBy, setHostedBy] = useState("");
  const [eventType, setEventType] = useState("conference");
  const [customEventType, setCustomEventType] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const router = useRouter();

  const handleCreateEvent = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to create an event.");
      return;
    }

    const creatorUid = currentUser.uid;
    const guestList = [];

    if (eventName.trim() === "") {
      Alert.alert("Error", "Event name is required.");
      return;
    }
    if (!eventDate) {
      Alert.alert("Error", "Event date is required.");
      return;
    }
    if (eventLocation.trim() === "") {
      Alert.alert("Error", "Event location is required.");
      return;
    }
    if (isNaN(Number(eventBudget)) || Number(eventBudget) <= 0) {
      Alert.alert("Error", "Please enter a valid budget.");
      return;
    }
    if (description.trim() === "") {
      Alert.alert("Error", "Description is required.");
      return;
    }
    if (hostedBy.trim() === "") {
      Alert.alert("Error", "Hosted By is required.");
      return;
    }
    if (eventType === "other" && customEventType.trim() === "") {
      Alert.alert("Error", "Please enter a custom event type.");
      return;
    }

    const finalEventType = eventType === "other" ? customEventType : eventType;

    try {
      const docRef = await addDoc(collection(db, "events"), {
        name: eventName,
        date: moment(eventDate).format("YYYY-MM-DD"),
        startTime: moment(startTime).format("HH:mm"),
        endTime: moment(endTime).format("HH:mm"),
        location: eventLocation,
        budget: eventBudget,
        description: description,
        hostedBy: hostedBy,
        eventType: finalEventType,
        createdAt: new Date(),
        creatorUid: creatorUid,
        guestList: guestList,
        isPrivate: isPrivate,
      });
      Alert.alert("Success", "Event created successfully!");
      router.push("/events");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Failed to create event.");
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* Form Fields */}
      {/* Add your form fields here */}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent", // Make the container transparent to show the background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 25,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  formContainer: {
    width: "100%",
    maxWidth: 500,
  },
});
