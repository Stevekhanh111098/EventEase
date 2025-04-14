import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import ScreenContainer from "@/components/ScreenContainer";

export default function AddVendorScreen() {
  const [vendor, setVendor] = useState({
    name: "",
    type: "",
    location: "",
    budgetRange: "",
    rating: "",
    description: "",
    eventTypes: "",
  });

  const handleAddVendor = async () => {
    if (!vendor.name || !vendor.type || !vendor.location) {
      Alert.alert("Error", "Name, type, and location are required.");
      return;
    }

    try {
      await addDoc(collection(db, "vendors"), {
        ...vendor,
        eventTypes: vendor.eventTypes.split(",").map((type) => type.trim()),
        rating: parseFloat(vendor.rating),
      });
      Alert.alert("Success", "Vendor added successfully.");
      setVendor({
        name: "",
        type: "",
        location: "",
        budgetRange: "",
        rating: "",
        description: "",
        eventTypes: "",
      });
    } catch (error) {
      console.error("Failed to add vendor:", error);
      Alert.alert("Error", "Failed to add vendor.");
    }
  };

  return (
    <ScreenContainer insideTabs={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Vendor</Text>
        <TextInput
          style={styles.input}
          placeholder="Vendor Name"
          value={vendor.name}
          onChangeText={(text) =>
            setVendor((prev) => ({ ...prev, name: text }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Vendor Type"
          value={vendor.type}
          onChangeText={(text) =>
            setVendor((prev) => ({ ...prev, type: text }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={vendor.location}
          onChangeText={(text) =>
            setVendor((prev) => ({ ...prev, location: text }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Budget Range"
          value={vendor.budgetRange}
          onChangeText={(text) =>
            setVendor((prev) => ({ ...prev, budgetRange: text }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Rating (1-5)"
          keyboardType="numeric"
          value={vendor.rating}
          onChangeText={(text) =>
            setVendor((prev) => ({ ...prev, rating: text }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={vendor.description}
          onChangeText={(text) =>
            setVendor((prev) => ({ ...prev, description: text }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Event Types (comma-separated)"
          value={vendor.eventTypes}
          onChangeText={(text) =>
            setVendor((prev) => ({ ...prev, eventTypes: text }))
          }
        />
        <TouchableOpacity onPress={handleAddVendor} style={styles.addButton}>
          <Text style={styles.buttonText}>Add Vendor</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
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
