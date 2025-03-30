import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "@/firebase";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const EventForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const isEdit = !!params.id;

  const [event, setEvent] = useState({
    name: "",
    date: new Date(),
    location: "",
    budget: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setEvent({
        name: String(params.name ?? ""),
        date: moment(params.date, "YYYY-MM-DD").toDate(),
        location: String(params.location ?? ""),
        budget: String(params.budget ?? ""),
      });
    }
  }, [params]);

  const handleChange = (name, value) => {
    setEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmDate = (selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEvent(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    const payload = {
      name: event.name,
      date: moment(event.date).format("YYYY-MM-DD"),
      location: event.location,
      budget: event.budget,
    };

    try {
      if (isEdit) {
        await updateDoc(doc(db, "events", String(params.id)), payload);
        alert("Event updated!");
      } else {
        await addDoc(collection(db, "events"), {
          ...payload,
          createdAt: new Date(),
        });
        alert("Event created!");
      }
      router.push("/events");
    } catch (err) {
      alert("Error saving event: " + err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>{isEdit ? "Edit Event" : "Create New Event"}</Text>

      <TextInput
        placeholder="Event Name"
        value={event.name}
        onChangeText={text => handleChange("name", text)}
        style={styles.input}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          placeholder="Select Date"
          value={moment(event.date).format("YYYY-MM-DD")}
          editable={false}
          style={styles.input}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setShowDatePicker(false)}
      />

      <TextInput
        placeholder="Location"
        value={event.location}
        onChangeText={text => handleChange("location", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Budget"
        value={event.budget}
        onChangeText={text => handleChange("budget", text)}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title={isEdit ? "Update Event" : "Create Event"} onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default EventForm;
