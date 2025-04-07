import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";

type EventItem = {
  id: string;
  name: string;
  date: string;
  location: string;
  budget: string;
};

export default function EventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentlyEditingId, setCurrentlyEditingId] = useState<string | null>(null);
  const [editedEvent, setEditedEvent] = useState<Partial<EventItem>>({});

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: EventItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<EventItem, "id">),
      }));
      setEvents(fetched);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleEdit = (event: EventItem) => {
    setCurrentlyEditingId(event.id);
    setEditedEvent({ ...event });
  };

  const handleSave = async () => {
    if (!currentlyEditingId) return;

    try {
      await updateDoc(doc(db, "events", currentlyEditingId), {
        name: editedEvent.name,
        date: editedEvent.date,
        location: editedEvent.location,
        budget: editedEvent.budget,
      });

      setCurrentlyEditingId(null);
      setEditedEvent({});
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  const handleDelete = (eventId: string) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "events", eventId));
              // onSnapshot will handle state update automatically
            } catch (error) {
              console.error("Failed to delete event:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: EventItem }) => {
    const isEditing = currentlyEditingId === item.id;

    return (
      <View style={styles.eventItem}>
        {isEditing ? (
          <>
            <TextInput
              value={editedEvent.name}
              onChangeText={(text) =>
                setEditedEvent((prev) => ({ ...prev, name: text }))
              }
              style={styles.input}
              placeholder="Name"
            />
            <TextInput
              value={editedEvent.date}
              onChangeText={(text) =>
                setEditedEvent((prev) => ({ ...prev, date: text }))
              }
              style={styles.input}
              placeholder="Date"
            />
            <TextInput
              value={editedEvent.location}
              onChangeText={(text) =>
                setEditedEvent((prev) => ({ ...prev, location: text }))
              }
              style={styles.input}
              placeholder="Location"
            />
            <TextInput
              value={editedEvent.budget}
              onChangeText={(text) =>
                setEditedEvent((prev) => ({ ...prev, budget: text }))
              }
              style={styles.input}
              placeholder="Budget"
              keyboardType="numeric"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Budget: ${item.budget}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event List</Text>
      {events.length === 0 ? (
        <Text style={styles.subtitle}>No events found.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/eventcreation")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 30, textAlign: "center", color: "#000" },
  subtitle: { fontSize: 16, marginTop: 10, textAlign: "center", color: "gray" },
  listContainer: { padding: 20 },
  eventItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  eventName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#34C759",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
