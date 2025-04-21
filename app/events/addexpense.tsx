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
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

export default function AddExpense() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    description: "",
  });

  const handleAddExpense = async () => {
    if (!expense.category || !expense.amount) {
      Alert.alert("Error", "Category and amount are required.");
      return;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        eventId,
        category: expense.category,
        amount: parseFloat(expense.amount),
        description: expense.description,
        createdAt: new Date(),
      });
      Alert.alert("Success", "Expense added successfully.");
      router.back();
    } catch (error) {
      console.error("Failed to add expense:", error);
      Alert.alert("Error", "Failed to add expense.");
    }
  };

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

  return (
    <View
      style={[styles.container, { backgroundColor: themedColors.background }]}
    >
      <Text style={[styles.title, { color: themedColors.primary }]}>
        Add Expense
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
        placeholder="Category"
        placeholderTextColor={themedColors.secondary}
        value={expense.category}
        onChangeText={(text) =>
          setExpense((prev) => ({ ...prev, category: text }))
        }
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themedColors.surface,
            borderColor: themedColors.border,
            color: themedColors.text,
          },
        ]}
        placeholder="Amount"
        placeholderTextColor={themedColors.secondary}
        keyboardType="numeric"
        value={expense.amount}
        onChangeText={(text) =>
          setExpense((prev) => ({ ...prev, amount: text }))
        }
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themedColors.surface,
            borderColor: themedColors.border,
            color: themedColors.text,
          },
        ]}
        placeholder="Description"
        placeholderTextColor={themedColors.secondary}
        value={expense.description}
        onChangeText={(text) =>
          setExpense((prev) => ({ ...prev, description: text }))
        }
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: themedColors.primary }]}
        onPress={handleAddExpense}
      >
        <Text style={[styles.buttonText, { color: themedColors.background }]}>
          Add Expense
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
