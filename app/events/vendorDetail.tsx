import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function VendorDetailScreen() {
  const router = useRouter();
  const { vendorId, eventId } = useLocalSearchParams();
  const [vendor, setVendor] = useState<{
    name: string;
    type: string;
    budgetRange: string;
    rating: number;
    location: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const fetchVendor = async () => {
      if (!vendorId) {
        Alert.alert("Error", "Vendor ID is missing.");
        router.back();
        return;
      }

      const vendorRef = doc(db, "vendors", vendorId);
      const vendorSnapshot = await getDoc(vendorRef);
      if (vendorSnapshot.exists()) {
        setVendor(
          vendorSnapshot.data() as {
            name: string;
            type: string;
            budgetRange: string;
            rating: number;
            location: string;
            description: string;
          }
        );
      } else {
        Alert.alert("Error", "Vendor not found.");
        router.back();
      }
    };

    fetchVendor();
  }, [vendorId]);

  const handleBookVendor = async () => {
    if (!eventId) {
      Alert.alert("Error", "Event ID is missing. Cannot book vendor.");
      return;
    }

    try {
      await addDoc(collection(db, "eventVendors"), {
        eventId,
        vendorId,
        status: "booked",
        notes: "",
      });
      Alert.alert("Success", "Vendor booked for this event.");
      router.back();
    } catch (error) {
      console.error("Failed to book vendor:", error);
      Alert.alert("Error", "Failed to book vendor.");
    }
  };

  if (!vendor) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{vendor.name}</Text>
      <Text>Type: {vendor.type}</Text>
      <Text>Budget Range: {vendor.budgetRange}</Text>
      <Text>Rating: {vendor.rating}</Text>
      <Text>Location: {vendor.location}</Text>
      <Text>Description: {vendor.description}</Text>

      {eventId ? (
        <TouchableOpacity onPress={handleBookVendor} style={styles.bookButton}>
          <Text style={styles.buttonText}>📌 Book for This Event</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.warningText}>
          Booking is disabled.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  bookButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  warningText: { color: "red", marginTop: 20, fontWeight: "bold" },
});
