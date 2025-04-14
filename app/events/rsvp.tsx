import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function RSVP() {
  const router = useRouter();
  const { eventId, guestEmail, docId } = useLocalSearchParams();
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [eventName, setEventName] = useState("");

  React.useEffect(() => {
    const fetchEventName = async () => {
      try {
        const eventRef = doc(db, "events", eventId);
        const eventDoc = await getDoc(eventRef);
        if (eventDoc.exists()) {
          setEventName(eventDoc.data().name);
        } else {
          console.log("No such event!");
        }
      } catch (error) {
        console.error("Error fetching event name:", error);
      }
    };

    if (eventId) {
      fetchEventName();
    }
  }, [eventId]);

  const handleRSVP = async (status) => {
    try {
      const guestRef = doc(db, "guestLists", docId);
      await updateDoc(guestRef, { rsvp: status });

      Alert.alert("Success", `RSVP updated to: ${status}`);
      setRsvpStatus(status);
    } catch (error) {
      console.error("Failed to update RSVP:", error);
      Alert.alert("Error", "Failed to update RSVP.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RSVP for Event</Text>
      <Text style={styles.subtitle}>Event: {eventName}</Text>
      {/* <Text style={styles.subtitle}>Guest: {guestName}</Text> */}
      <TouchableOpacity onPress={() => handleRSVP("Yes")} style={styles.button}>
        <Text style={styles.buttonText}>Yes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRSVP("No")} style={styles.button}>
        <Text style={styles.buttonText}>No</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleRSVP("Maybe")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Maybe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 20 },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
