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
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

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
  const [isBooked, setIsBooked] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

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

  useEffect(() => {
    const checkIfVendorBooked = async () => {
      if (!eventId || !vendorId) return;

      const q = query(
        collection(db, "eventVendors"),
        where("eventId", "==", eventId),
        where("vendorId", "==", vendorId)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setIsBooked(true);
      }
    };

    checkIfVendorBooked();
  }, [eventId, vendorId]);

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
    <ScrollView
      style={[styles.container, { backgroundColor: themedColors.background }]}
    >
      <Text style={[styles.title, { color: themedColors.primary }]}>
        Vendor Details
      </Text>
      {vendor && (
        <View
          style={[styles.vendorCard, { backgroundColor: themedColors.surface }]}
        >
          <Text style={[styles.vendorName, { color: themedColors.text }]}>
            {vendor.name}
          </Text>
          <Text style={[styles.vendorDetail, { color: themedColors.text }]}>
            Type: {vendor.type}
          </Text>
          <Text style={[styles.vendorDetail, { color: themedColors.text }]}>
            Budget: {vendor.budgetRange}
          </Text>
          <Text style={[styles.vendorDetail, { color: themedColors.text }]}>
            Location: {vendor.location}
          </Text>
          <Text style={[styles.vendorDetail, { color: themedColors.text }]}>
            Rating: {vendor.rating} ⭐
          </Text>
          <Text style={[styles.vendorDetail, { color: themedColors.text }]}>
            Description: {vendor.description}
          </Text>
        </View>
      )}
      {isBooked ? (
        <Text style={styles.warningText}>
          Vendor is already booked for this event.
        </Text>
      ) : (
        eventId && (
          <TouchableOpacity
            onPress={handleBookVendor}
            style={[
              styles.bookButton,
              { backgroundColor: themedColors.primary },
            ]}
          >
            <Text style={styles.buttonText}>Book for This Event</Text>
          </TouchableOpacity>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  vendorCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  vendorName: { fontSize: 18, fontWeight: "bold" },
  vendorDetail: { fontSize: 14 },
  bookButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  warningText: { color: "red", marginTop: 20, fontWeight: "bold" },
});
