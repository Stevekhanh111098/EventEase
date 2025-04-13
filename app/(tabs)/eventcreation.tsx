import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "expo-router";
import moment from "moment";
import { getAuth } from "firebase/auth";
import DropDownPicker from "react-native-dropdown-picker";
import ScreenContainer from "@/components/ScreenContainer";

export default function CreateEventScreen() {
  return (
    <ScreenContainer>
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Create New Event</Text>
        </View>
        <EventForm />
      </ScrollView>
    </ScreenContainer>
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
  const [customEventType, setCustomEventType] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState(null);
  const [items, setItems] = useState([
    { label: "Conference", value: "conference" },
    { label: "Workshop", value: "workshop" },
    { label: "Party", value: "party" },
    { label: "Wedding", value: "wedding" },
    { label: "Meeting", value: "meeting" },
    { label: "Corporate", value: "corporate" },
    { label: "Other", value: "other" },
  ]);

  const handleCreateEvent = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to create an event.");
      return;
    }

    const creatorUid = currentUser.uid;
    const guestList = [];

    if (eventName.trim() === "")
      return Alert.alert("Error", "Event name is required.");
    if (!eventDate) return Alert.alert("Error", "Event date is required.");
    if (eventLocation.trim() === "")
      return Alert.alert("Error", "Event location is required.");
    if (isNaN(Number(eventBudget)) || Number(eventBudget) <= 0)
      return Alert.alert("Error", "Please enter a valid budget.");
    if (description.trim() === "")
      return Alert.alert("Error", "Description is required.");
    if (hostedBy.trim() === "")
      return Alert.alert("Error", "Hosted By is required.");
    if (eventType === "other" && customEventType.trim() === "")
      return Alert.alert("Error", "Please enter a custom event type.");
    if (startTime >= endTime)
      return Alert.alert("Error", "Start time must be before end time.");

    const finalEventType = eventType === "other" ? customEventType : eventType;

    try {
      const docRef = await addDoc(collection(db, "events"), {
        name: eventName,
        date: moment(eventDate).format("YYYY-MM-DD"),
        startTime: moment(startTime).toISOString(),
        endTime: moment(endTime).toISOString(),
        location: eventLocation,
        budget: Number(eventBudget),
        description: description,
        hostedBy: hostedBy,
        eventType: finalEventType,
        createdAt: new Date(),
        creatorUid: creatorUid,
        guestList: guestList,
        isPrivate: isPrivate,
      });
      Alert.alert("Success", "Event created successfully!");
      console.log("Event successfully created with ID:", docRef.id);
      router.push("/events");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Failed to create event.");
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const onStartTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setStartTime(selectedTime);
      if (selectedTime >= endTime) {
        const newEndTime = new Date(selectedTime);
        newEndTime.setHours(newEndTime.getHours() + 1);
        setEndTime(newEndTime);
      }
    }
  };

  const onEndTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      if (selectedTime <= startTime) {
        Alert.alert(
          "Invalid Time",
          "End time cannot be earlier than or the same as the start time."
        );
      } else {
        setEndTime(selectedTime);
      }
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Event Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter event name"
        value={eventName}
        onChangeText={setEventName}
      />

      <Text style={styles.label}>Event Date</Text>
      <DateTimePicker
        testID="datePicker"
        value={eventDate}
        mode="date"
        display="default"
        onChange={onDateChange}
      />

      <View style={styles.rowContainer}>
        <View style={styles.timePickerContainer}>
          <Text style={styles.label}>Start Time</Text>
          <DateTimePicker
            testID="startTimePicker"
            value={startTime}
            mode="time"
            display="default"
            onChange={onStartTimeChange}
            is24Hour={false}
          />
        </View>

        <View style={styles.timePickerContainer}>
          <Text style={styles.label}>End Time</Text>
          <DateTimePicker
            testID="endTimePicker"
            value={endTime}
            mode="time"
            display="default"
            onChange={onEndTimeChange}
            is24Hour={false}
          />
        </View>
      </View>

      <Text style={styles.label}>Event Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter event location"
        value={eventLocation}
        onChangeText={setEventLocation}
      />

      <Text style={styles.label}>Event Budget ($)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 1000"
        keyboardType="numeric"
        value={eventBudget}
        onChangeText={setEventBudget}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder="Enter event description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Hosted By</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter host name"
        value={hostedBy}
        onChangeText={setHostedBy}
      />

      <Text style={styles.label}>Event Type</Text>
      <View style={styles.pickerContainer}>
        <DropDownPicker
          open={open}
          value={eventType}
          items={items}
          setOpen={setOpen}
          setValue={setEventType}
          setItems={setItems}
          placeholder="Select Event Type"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>
      {eventType === "other" && (
        <TextInput
          style={styles.input}
          placeholder="Specify event type"
          value={customEventType}
          onChangeText={setCustomEventType}
        />
      )}

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Private Event?</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isPrivate ? "#007AFF" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setIsPrivate}
          value={isPrivate}
        />
        <Text style={styles.switchLabel}>
          {isPrivate ? "Yes (Invite Only)" : "No (Public)"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleCreateEvent}
      >
        <Text style={styles.button}>Create Event</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  formContainer: {
    width: "100%",
    padding: 10,
  },
  input: {
    height: 45,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },

  inputTouchable: {
    height: 45,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: "center",
  },

  inputText: {
    fontSize: 16,
    color: "#333",
  },
  descriptionInput: {
    minHeight: 100,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  buttonContainer: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    elevation: 2, // adds shadow on Android
    shadowColor: "#000", // for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  button: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    height: 50,
  },
  picker: {
    width: "100%",
    height: 50,
  },
  rowContainer: {
    flexDirection: "row",
    marginBottom: 0,
    gap: 15,
  },
  timePickerContainer: {
    flex: 1,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: "#555",
    flexShrink: 1,
  },
  pickerContainer: {
    zIndex: 1000, // Ensure it's above other elements
    marginBottom: 16,
  },

  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },

  dropdownContainer: {
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
});
