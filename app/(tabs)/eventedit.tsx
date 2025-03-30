// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   Alert,
//   TouchableOpacity,
//   Keyboard,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "@/firebase";
// import { Ionicons } from "@expo/vector-icons";
// import KeyboardAvoidingWrapper from "@/components/KeyboardAvoidingWrapper";

// export default function EventEdit() {
//   const { id, name, date, location, budget } = useLocalSearchParams();
//   const router = useRouter();

//   // Convert to strings to ensure TextInput accepts them
//   const [eventName, setEventName] = useState(String(name || ""));
//   const [eventDate, setEventDate] = useState(String(date || ""));
//   const [eventLocation, setEventLocation] = useState(String(location || ""));
//   const [eventBudget, setEventBudget] = useState(String(budget || ""));

//   const handleUpdate = async () => {
//     Keyboard.dismiss();

//     if (!eventName || !eventDate || !eventLocation || !eventBudget) {
//       Alert.alert("Error", "All fields are required.");
//       return;
//     }

//     try {
//       await updateDoc(doc(db, "events", String(id)), {
//         name: eventName,
//         date: eventDate,
//         location: eventLocation,
//         budget: eventBudget,
//       });
//       Alert.alert("Success", "Event updated.");
//       router.back();
//     } catch (error) {
//       console.error("Update failed:", error);
//       Alert.alert("Error", "Failed to update event.");
//     }
//   };

//   return (
//     <KeyboardAvoidingWrapper>
//       <View style={styles.container}>
//         {/* Back Button */}
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#007AFF" />
//         </TouchableOpacity>

//         <Text style={styles.title}>Edit Event</Text>

//         <TextInput
//           placeholder="Event Name"
//           value={eventName}
//           onChangeText={setEventName}
//           style={styles.input}
//         />
//         <TextInput
//           placeholder="Date"
//           value={eventDate}
//           onChangeText={setEventDate}
//           style={styles.input}
//         />
//         <TextInput
//           placeholder="Location"
//           value={eventLocation}
//           onChangeText={setEventLocation}
//           style={styles.input}
//         />
//         <TextInput
//           placeholder="Budget"
//           value={eventBudget}
//           onChangeText={setEventBudget}
//           keyboardType="numeric"
//           style={styles.input}
//         />

//         <Button title="Update Event" onPress={handleUpdate} />
//       </View>
//     </KeyboardAvoidingWrapper>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     paddingTop: 60,
//     backgroundColor: "#fff",
//   },
//   backButton: {
//     position: "absolute",
//     top: 40,
//     left: 20,
//     zIndex: 10,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     marginBottom: 12,
//     borderRadius: 6,
//     paddingHorizontal: 10,
//     height: 40,
//   },
// });
