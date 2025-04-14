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
import DropDownPicker from "react-native-dropdown-picker";

export default function AddVendorScreen() {
  const [vendor, setVendor] = useState({
    name: "",
    type: "",
    location: "",
    budgetRange: "",
    rating: "",
    description: "",
    eventTypes: [],
  });

  const [vendorTypeItems] = useState([
    { label: "Caterer", value: "caterer" },
    { label: "Photographer", value: "photographer" },
    { label: "Decorator", value: "decorator" },
    { label: "Venue", value: "venue" },
    { label: "DJ", value: "dj" },
    { label: "Musician", value: "musician" },
    { label: "Planner", value: "planner" },
    { label: "Florist", value: "florist" },
    { label: "Rental Services", value: "rental_services" },
    { label: "Transportation", value: "transportation" },
    { label: "Makeup Artist", value: "makeup_artist" },
    { label: "Baker", value: "baker" },
    { label: "Security", value: "security" },
  ]);

  const [eventTypeItems] = useState([
    { label: "Wedding", value: "wedding" },
    { label: "Birthday", value: "birthday" },
    { label: "Corporate", value: "corporate" },
    { label: "Baby Shower", value: "baby_shower" },
    { label: "Anniversary", value: "anniversary" },
    { label: "Graduation", value: "graduation" },
    { label: "Festival", value: "festival" },
    { label: "Private Party", value: "private_party" },
    { label: "Religious", value: "religious" },
  ]);

  const [open, setOpen] = useState(false);
  const [openType, setOpenType] = useState(false);

  const handleAddVendor = async () => {
    if (!vendor.name || !vendor.type || !vendor.location) {
      Alert.alert("Error", "Name, type, and location are required.");
      return;
    }

    try {
      await addDoc(collection(db, "vendors"), {
        ...vendor,
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
        eventTypes: [],
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
        <DropDownPicker
          open={openType}
          value={vendor.type}
          items={vendorTypeItems}
          setOpen={setOpenType}
          setValue={(callback) =>
            setVendor((prev) => ({ ...prev, type: callback(prev.type) }))
          }
          multiple={false}
          placeholder="Select Vendor Type"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
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
        <DropDownPicker
          open={open}
          value={vendor.eventTypes}
          items={eventTypeItems}
          setOpen={setOpen}
          setValue={(callback) =>
            setVendor((prev) => ({
              ...prev,
              eventTypes: callback(prev.eventTypes),
            }))
          }
          multiple={true}
          min={0}
          max={7}
          placeholder="Select Event Types"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
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
  dropdown: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  dropdownContainer: {
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
