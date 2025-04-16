import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Colors } from "@/constants/Colors";

export default function RSVP() {
  const router = useRouter();
  const { eventId, guestEmail, docId } = useLocalSearchParams();
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [eventName, setEventName] = useState("");
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

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
    <View
      style={[styles.container, { backgroundColor: themedColors.background }]}
    >
      <Text style={[styles.title, { color: themedColors.primary }]}>
        RSVP for Event
      </Text>
      <Text style={[styles.subtitle, { color: themedColors.text }]}>
        Event: {eventName}
      </Text>
      <TouchableOpacity
        onPress={() => handleRSVP("Yes")}
        style={[styles.button, { backgroundColor: themedColors.primary }]}
      >
        <Text style={[styles.buttonText, { color: themedColors.background }]}>
          Yes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleRSVP("No")}
        style={[styles.button, { backgroundColor: themedColors.accent }]}
      >
        <Text style={[styles.buttonText, { color: themedColors.background }]}>
          No
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleRSVP("Maybe")}
        style={[styles.button, { backgroundColor: themedColors.secondary }]}
      >
        <Text style={[styles.buttonText, { color: themedColors.background }]}>
          Maybe
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 20 },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { textAlign: "center", fontWeight: "bold" },
});
