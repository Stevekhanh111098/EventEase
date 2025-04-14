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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={expense.category}
        onChangeText={(text) =>
          setExpense((prev) => ({ ...prev, category: text }))
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={expense.amount}
        onChangeText={(text) =>
          setExpense((prev) => ({ ...prev, amount: text }))
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={expense.description}
        onChangeText={(text) =>
          setExpense((prev) => ({ ...prev, description: text }))
        }
      />
      <TouchableOpacity onPress={handleAddExpense} style={styles.addButton}>
        <Text style={styles.buttonText}>Add Expense</Text>
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
