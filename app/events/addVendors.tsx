import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import ScreenContainer from "@/components/ScreenContainer";
import DropDownPicker from "react-native-dropdown-picker";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

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

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

  const handleAddVendor = async () => {
    if (!vendor.name || !vendor.type || !vendor.location) {
      Alert.alert("Error", "Name, type, and location are required.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "vendors"), {
        ...vendor,
        rating: parseFloat(vendor.rating),
      });
      // Store the document ID as the vendor ID
      await updateDoc(docRef, { id: docRef.id });
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
      <View
        style={[styles.container, { backgroundColor: themedColors.background }]}
      >
        <Text style={[styles.title, { color: themedColors.primary }]}>
          Add Vendor
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
          placeholder="Vendor Name"
          placeholderTextColor={themedColors.secondary}
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
          style={[
            styles.dropdown,
            {
              backgroundColor: themedColors.surface,
              borderColor: themedColors.border,
            },
          ]}
          dropDownContainerStyle={[
            styles.dropdownContainer,
            {
              backgroundColor: themedColors.surface,
              borderColor: themedColors.border,
            },
          ]}
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
          placeholder="Location"
          placeholderTextColor={themedColors.secondary}
          value={vendor.location}
          onChangeText={(text) =>
            setVendor((prev) => ({ ...prev, location: text }))
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
          placeholder="Budget Range"
          placeholderTextColor={themedColors.secondary}
          value={vendor.budgetRange}
          onChangeText={(text) =>
            setVendor((prev) => ({ ...prev, budgetRange: text }))
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
          placeholder="Rating (1-5)"
          keyboardType="numeric"
          placeholderTextColor={themedColors.secondary}
          value={vendor.rating}
          onChangeText={(text) =>
            setVendor((prev) => ({ ...prev, rating: text }))
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
          style={[
            styles.dropdown,
            {
              backgroundColor: themedColors.surface,
              borderColor: themedColors.border,
            },
          ]}
          dropDownContainerStyle={[
            styles.dropdownContainer,
            {
              backgroundColor: themedColors.surface,
              borderColor: themedColors.border,
            },
          ]}
        />

        <TouchableOpacity
          onPress={handleAddVendor}
          style={[styles.addButton, { backgroundColor: themedColors.primary }]}
        >
          <Text style={[styles.buttonText, { color: themedColors.background }]}>
            Add Vendor
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
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
  dropdown: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  dropdownContainer: {
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
  buttonText: { textAlign: "center", fontWeight: "bold" },
});
