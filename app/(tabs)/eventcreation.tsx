import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, Platform, SafeAreaView, ScrollView, TouchableOpacity, Switch, ImageBackground } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "expo-router";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import CustomText from "@/components/CustomText"; // Import CustomText

export default function CreateEventScreen() {
  return (
    <ImageBackground
      source={require("../../photo/background/lineBG.jpg")} // Set the background image
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <CustomText style={styles.header}>Create New Event</CustomText>
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
        <CustomText style={styles.label}>Event Name</CustomText>
        <TextInput
          style={styles.input}
          placeholder="Enter event name"
          value={eventName}
          onChangeText={setEventName}
        />
      </View>

      <View>
        <CustomText style={styles.label}>Event Date</CustomText>
        <TouchableOpacity
          style={styles.input} // Reuse the input style for the TouchableOpacity
          onPress={() => setShowDatePicker(true)}
        >
          <CustomText style={styles.dateText}>
            {moment(eventDate).format("MM/DD/YYYY")}
          </CustomText>
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
          <CustomText style={styles.label}>Start Time</CustomText>
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
          <CustomText style={styles.label}>End Time</CustomText>
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
        <CustomText style={styles.label}>Event Location</CustomText>
        <TextInput
          style={styles.input}
          placeholder="Enter event location"
          value={eventLocation}
          onChangeText={setEventLocation}
        />
      </View>

      <View>
        <CustomText style={styles.label}>Event Budget</CustomText>
        <TextInput
          style={styles.input}
          placeholder="Enter event budget ($)"
          keyboardType="numeric"
          value={eventBudget}
          onChangeText={setEventBudget}
        />
      </View>

      <View>
        <CustomText style={styles.label}>Description</CustomText>
        <TextInput
          style={styles.descriptionInput} // Use the new style for description
          placeholder="Enter event description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <View>
        <CustomText style={styles.label}>Hosted By</CustomText>
        <TextInput
          style={styles.input}
          placeholder="Enter host name"
          value={hostedBy}
          onChangeText={setHostedBy}
        />
      </View>

      <View>
        <CustomText style={styles.label}>Event Type</CustomText>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={eventType}
            onValueChange={(itemValue) => setEventType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Concert" value="concert" />
            <Picker.Item label="Conference" value="conference" />
            <Picker.Item label="E-Sport" value="e-sport" />
            <Picker.Item label="Meeting" value="meeting" />
            <Picker.Item label="Party" value="party" />
            <Picker.Item label="Sport" value="sport" />
            <Picker.Item label="Training Session" value="training-session" />
            <Picker.Item label="Wedding" value="wedding" />
            <Picker.Item label="Workshop" value="workshop" />
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
        <CustomText style={styles.label}>Event Visibility</CustomText>
        <View style={styles.rowContainer}>
          <CustomText style={{ marginRight: 10, color: "#5F6B89" }}>{isPrivate ? "Private" : "Public"}</CustomText>
          <Switch
            value={isPrivate}
            onValueChange={(value) => setIsPrivate(value)}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.createEventButton} onPress={handleCreateEvent}>
          <CustomText style={styles.createEventButtonText}>Create Event</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent", // Ensure the container background is transparent
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E3A59", // Text color
    backgroundColor: "transparent", // Ensure the header background is transparent
  },
  label: {
    fontSize: 16,
    color: "#2E3A59", // Text color
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent", // Ensure the scroll container background is transparent
  },
  headerContainer: {
    paddingTop: 40, // Adjusted to move the header lower
    paddingBottom: 25,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#C7D7E2",
    backgroundColor: "transparent", // Ensure the header container background is transparent
  },
  formContainer: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "transparent", // Ensure the form container background is transparent
  },
  input: {
    height: 40,
    width: "100%",
    borderBottomColor: "#C7D7E2", // Bottom border color
    borderBottomWidth: 1, // Only the bottom border
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "#5F6B89", // Text color
    backgroundColor: "transparent", // Ensure the input background is transparent
  },
  descriptionInput: {
    height: 100, // Increased height for the description input
    width: "100%",
    borderBottomColor: "#C7D7E2", // Bottom border color
    borderBottomWidth: 1, // Only the bottom border
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "#5F6B89", // Text color
    textAlignVertical: "top", // Align text to the top for multiline input
    backgroundColor: "transparent", // Ensure the description input background is transparent
  },
  pickerContainer: {
    borderBottomColor: "#C7D7E2", // Bottom border color
    borderBottomWidth: 1, // Only the bottom border
    marginBottom: 10,
    width: "100%", // Ensure it takes the full width of the container
    maxWidth: 500, // Optional: Limit the maximum width
    paddingHorizontal: 10, // Add padding for better spacing
    backgroundColor: "transparent", // Ensure the picker container background is transparent
  },
  picker: {
    height: 50,
    width: "100%", // Ensure the picker takes the full width of its container
    fontSize: 14, // Reduce font size to fit text properly
    color: "#2E3A59", // Text color
    backgroundColor: "transparent", // Ensure the picker background is transparent
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    backgroundColor: "transparent", // Ensure the row container background is transparent
  },
  timePickerContainer: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "transparent", // Ensure the time picker container background is transparent
  },
  dateText: {
    color: "#2E3A59", // Text color for date text
    backgroundColor: "transparent", // Ensure the date text background is transparent
  },
  backToLoginText: {
    color: "#2E3A59", // Text color for back-to-login text
    backgroundColor: "transparent", // Ensure the back-to-login text background is transparent
  },
  background: {
    flex: 1,
    backgroundColor: "transparent", // Ensure the overall background is transparent
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center", // Center the button horizontally
  },
  createEventButton: {
    backgroundColor: "#7DCDB1", // Button background color
    paddingVertical: 12, // Vertical padding for the button
    paddingHorizontal: 20, // Horizontal padding for the button
    borderRadius: 8, // Rounded corners
    alignItems: "center", // Center the text inside the button
    width: "70%", // Set the button width
  },
  createEventButtonText: {
    color: "#FFFFFF", // Text color
    fontSize: 16, // Font size
    fontWeight: "bold", // Bold text
    textAlign: "center", // Center the text
  },
});
