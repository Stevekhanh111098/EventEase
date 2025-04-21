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
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

export default function AddTask() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [task, setTask] = useState({ title: "", deadline: "" });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

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
    <View
      style={[styles.container, { backgroundColor: themedColors.background }]}
    >
      <Text style={[styles.title, { color: themedColors.primary }]}>
        Add Task
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
        placeholder="Task Title"
        placeholderTextColor={themedColors.secondary}
        value={task.title}
        onChangeText={(text) => setTask((prev) => ({ ...prev, title: text }))}
      />
      <TouchableOpacity
        onPress={showDatePicker}
        style={[
          styles.input,
          {
            backgroundColor: themedColors.surface,
            borderColor: themedColors.border,
          },
        ]}
      >
        <Text style={{ color: themedColors.text }}>
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
      <TouchableOpacity
        onPress={handleAddTask}
        style={[styles.addButton, { backgroundColor: themedColors.primary }]}
      >
        <Text style={[styles.buttonText, { color: themedColors.background }]}>
          Add Task
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
  addButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { fontWeight: "bold" },
});
