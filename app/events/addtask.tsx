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
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function AddTask() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [task, setTask] = useState({ title: "", deadline: "" });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = (selectedDate: Date) => {
    setTask((prev) => ({ ...prev, deadline: selectedDate.toISOString() }));
    hideDatePicker();
  };

  const handleAddTask = async () => {
    if (!task.title || !task.deadline) {
      Alert.alert("Error", "Title and deadline are required.");
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        eventId,
        title: task.title,
        deadline: Timestamp.fromDate(new Date(task.deadline)),
        isCompleted: false,
      });
      Alert.alert("Success", "Task added successfully.");
      router.back();
    } catch (error) {
      console.error("Failed to add task:", error);
      Alert.alert("Error", "Failed to add task.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={task.title}
        onChangeText={(text) => setTask((prev) => ({ ...prev, title: text }))}
      />
      <TouchableOpacity onPress={showDatePicker} style={styles.input}>
        <Text>
          {task.deadline
            ? new Date(task.deadline).toLocaleDateString()
            : "Select Deadline"}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />
      <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
        <Text style={styles.buttonText}>Add Task</Text>
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
  addButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
