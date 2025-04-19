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
  Switch,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "@/firebase";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";

const EventForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const isEdit = !!params.id;

  const [event, setEvent] = useState({
    name: "",
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    location: "",
    budget: "",
    description: "",
    hostedBy: "",
    eventType: "conference",
    isPrivate: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setEvent({
        name: String(params.name ?? ""),
        date: moment(params.date, "YYYY-MM-DD").toDate(),
        startTime: moment(params.startTime, "HH:mm").toDate(),
        endTime: moment(params.endTime, "HH:mm").toDate(),
        location: String(params.location ?? ""),
        budget: String(params.budget ?? ""),
        description: String(params.description ?? ""),
        hostedBy: String(params.hostedBy ?? ""),
        eventType: String(params.eventType ?? "conference"),
        isPrivate: params.isPrivate === "true",
      });
    }
  }, [params]);

  const handleChange = (name: string, value: string | number | Date | boolean) => {
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmDate = (selectedDate: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEvent((prev) => ({ ...prev, date: selectedDate }));
    }
  };

  const handleConfirmStartTime = (selectedTime: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setEvent((prev) => ({ ...prev, startTime: selectedTime }));
    }
  };

  const handleConfirmEndTime = (selectedTime: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEvent((prev) => ({ ...prev, endTime: selectedTime }));
    }
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    const payload = {
      name: event.name,
      date: moment(event.date).format("YYYY-MM-DD"),
      startTime: moment(event.startTime).format("HH:mm"),
      endTime: moment(event.endTime).format("HH:mm"),
      location: event.location,
      budget: event.budget,
      description: event.description,
      hostedBy: event.hostedBy,
      eventType: event.eventType,
      isPrivate: event.isPrivate,
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
    } catch (err: any) {
      alert("Error saving event: " + err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>{isEdit ? "Edit Event" : "Create New Event"}</Text>

      <TextInput
        placeholder="Event Name"
        value={event.name}
        onChangeText={(text) => handleChange("name", text)}
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

      <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
        <TextInput
          placeholder="Start Time"
          value={moment(event.startTime).format("HH:mm")}
          editable={false}
          style={styles.input}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showStartTimePicker}
        mode="time"
        onConfirm={handleConfirmStartTime}
        onCancel={() => setShowStartTimePicker(false)}
      />

      <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
        <TextInput
          placeholder="End Time"
          value={moment(event.endTime).format("HH:mm")}
          editable={false}
          style={styles.input}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showEndTimePicker}
        mode="time"
        onConfirm={handleConfirmEndTime}
        onCancel={() => setShowEndTimePicker(false)}
      />

      <TextInput
        placeholder="Location"
        value={event.location}
        onChangeText={(text) => handleChange("location", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Budget"
        value={event.budget}
        onChangeText={(text) => handleChange("budget", text)}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={event.description}
        onChangeText={(text) => handleChange("description", text)}
        style={styles.input}
        multiline
      />

      <TextInput
        placeholder="Hosted By"
        value={event.hostedBy}
        onChangeText={(text) => handleChange("hostedBy", text)}
        style={styles.input}
      />

      <Text style={styles.label}>Event Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={event.eventType}
          onValueChange={(value) => handleChange("eventType", value)}
          style={styles.picker}
        >
          <Picker.Item label="Conference" value="conference" />
          <Picker.Item label="Workshop" value="workshop" />
          <Picker.Item label="Party" value="party" />
          <Picker.Item label="Meeting" value="meeting" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <View style={styles.rowContainer}>
        <Text style={{ marginRight: 10 }}>{event.isPrivate ? "Private" : "Public"}</Text>
        <Switch
          value={event.isPrivate}
          onValueChange={(value) => handleChange("isPrivate", value)}
        />
      </View>

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default EventForm;
