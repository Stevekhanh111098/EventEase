import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, Platform, SafeAreaView, ScrollView, TouchableOpacity, Switch } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "expo-router";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

export default function CreateEventScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Create New Event</Text>
        </View>
        <EventForm />
      </ScrollView>
    </SafeAreaView>
  );
}

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date()); // New state for start time
  const [endTime, setEndTime] = useState(new Date()); // New state for end time
  const [eventLocation, setEventLocation] = useState("");
  const [eventBudget, setEventBudget] = useState("");
  const [description, setDescription] = useState("");
  const [hostedBy, setHostedBy] = useState("");
  const [eventType, setEventType] = useState("conference");
  const [customEventType, setCustomEventType] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false); // New state for start time picker
  const [showEndTimePicker, setShowEndTimePicker] = useState(false); // New state for end time picker
  const [isPrivate, setIsPrivate] = useState(false); // New state for event visibility
  const router = useRouter();

  const handleCreateEvent = async () => {
    const auth = getAuth(); // Get the Firebase Auth instance
    const currentUser = auth.currentUser; // Get the currently logged-in user

    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to create an event.");
      return;
    }

    const creatorUid = currentUser.uid; // Get the creator's UID
    const guestList = []; // Initialize an empty guest list (you can populate this later)

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
        startTime: moment(startTime).format("HH:mm"), // Include start time
        endTime: moment(endTime).format("HH:mm"), // Include end time
        location: eventLocation,
        budget: eventBudget,
        description: description,
        hostedBy: hostedBy,
        eventType: finalEventType, // Include event type
        createdAt: new Date(),
        creatorUid: creatorUid, // Add the creator's UID
        guestList: guestList, // Add the guest list (empty for now)
        isPrivate: isPrivate, // Add event visibility
      });
      Alert.alert("Success", "Event created successfully!");
      console.log("Event successfully created with ID:", docRef.id);
      router.push("/events");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Failed to create event.");
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || eventDate;
    setShowDatePicker(Platform.OS === "ios");
    setEventDate(currentDate);
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date | undefined) => {
    const currentTime = selectedTime || startTime;
    setShowStartTimePicker(Platform.OS === "ios");
    setStartTime(currentTime);
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date | undefined) => {
    const currentTime = selectedTime || endTime;
    setShowEndTimePicker(Platform.OS === "ios");
    setEndTime(currentTime);
  };

  return (
    <View style={styles.formContainer}>
      <View>
        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event name"
          value={eventName}
          onChangeText={setEventName}
        />
      </View>

      <View>
        <Text style={styles.label}>Event Date</Text>
        <TouchableOpacity
          style={styles.input} // Reuse the input style for the TouchableOpacity
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {moment(eventDate).format("MM/DD/YYYY")}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={eventDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setEventDate(selectedDate);
            }}
          />
        )}
      </View>

      <View style={styles.rowContainer}>
        <TouchableOpacity
          style={styles.timePickerContainer}
          onPress={() => setShowStartTimePicker(true)}
        >
          <Text style={styles.label}>Start Time</Text>
          <TextInput
            style={styles.input}
            placeholder="Start Time (HH:mm)"
            value={moment(startTime).format("HH:mm")}
            editable={false} // Prevent manual editing
            pointerEvents="none" // Disable touch events on the TextInput
          />
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowStartTimePicker(false);
              if (selectedTime) setStartTime(selectedTime);
            }}
          />
        )}

        <TouchableOpacity
          style={styles.timePickerContainer}
          onPress={() => setShowEndTimePicker(true)}
        >
          <Text style={styles.label}>End Time</Text>
          <TextInput
            style={styles.input}
            placeholder="End Time (HH:mm)"
            value={moment(endTime).format("HH:mm")}
            editable={false} // Prevent manual editing
            pointerEvents="none" // Disable touch events on the TextInput
          />
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowEndTimePicker(false);
              if (selectedTime) setEndTime(selectedTime);
            }}
          />
        )}
      </View>

      <View>
        <Text style={styles.label}>Event Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event location"
          value={eventLocation}
          onChangeText={setEventLocation}
        />
      </View>

      <View>
        <Text style={styles.label}>Event Budget</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event budget ($)"
          keyboardType="numeric"
          value={eventBudget}
          onChangeText={setEventBudget}
        />
      </View>

      <View>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.descriptionInput} // Use the new style for description
          placeholder="Enter event description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <View>
        <Text style={styles.label}>Hosted By</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter host name"
          value={hostedBy}
          onChangeText={setHostedBy}
        />
      </View>

      <View>
        <Text style={styles.label}>Event Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={eventType}
            onValueChange={(itemValue) => setEventType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Conference" value="conference" />
            <Picker.Item label="Workshop" value="workshop" />
            <Picker.Item label="Party" value="party" />
            <Picker.Item label="Meeting" value="meeting" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
        {eventType === "other" && (
          <TextInput
            style={styles.input}
            placeholder="Enter custom event type"
            value={customEventType}
            onChangeText={setCustomEventType}
          />
        )}
      </View>

      <View>
        <Text style={styles.label}>Event Visibility</Text>
        <View style={styles.rowContainer}>
          <Text style={{ marginRight: 10 }}>{isPrivate ? "Private" : "Public"}</Text>
          <Switch
            value={isPrivate}
            onValueChange={(value) => setIsPrivate(value)}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Create Event" onPress={handleCreateEvent} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    paddingTop: 40, // Adjusted to move the header lower
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
  input: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "#000",
  },
  descriptionInput: {
    height: 100, // Increased height for the description input
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "#000",
    textAlignVertical: "top", // Align text to the top for multiline input
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    width: "100%", // Ensure it takes the full width of the container
    maxWidth: 500, // Optional: Limit the maximum width
    paddingHorizontal: 10, // Add padding for better spacing
  },
  picker: {
    height: 50,
    width: "100%", // Ensure the picker takes the full width of its container
    fontSize: 14, // Reduce font size to fit text properly
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timePickerContainer: {
    flex: 1,
    marginRight: 10,
  },
});
