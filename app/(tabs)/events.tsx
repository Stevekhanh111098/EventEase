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
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ScreenContainer from "@/components/ScreenContainer";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Card } from "react-native-paper";
import { format } from "date-fns";
import { getAuth, signOut } from "firebase/auth";

type EventItem = {
  id: string;
  name: string;
  date: string;
  location: string;
  budget: string;
  start: string; // New field
  end: string; // New field
};

export default function EventsScreen() {
  const router = useRouter();
  const auth = getAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentlyEditingId, setCurrentlyEditingId] = useState<string | null>(
    null
  );

  const bottomTabBarHeight = useBottomTabBarHeight();

  const [editedEvent, setEditedEvent] = useState<Partial<EventItem>>({});
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showStartTimePicker = () => setStartTimePickerVisible(true);
  const hideStartTimePicker = () => setStartTimePickerVisible(false);

  const showEndTimePicker = () => setEndTimePickerVisible(true);
  const hideEndTimePicker = () => setEndTimePickerVisible(false);

  const handleConfirmStartTime = (selectedTime: Date) => {
    setEditedEvent((prev) => ({ ...prev, start: selectedTime.toISOString() }));
    hideStartTimePicker();
  };

  const handleConfirmEndTime = (selectedTime: Date) => {
    setEditedEvent((prev) => ({ ...prev, end: selectedTime.toISOString() }));
    hideEndTimePicker();
  };

  let unsubscribe: (() => void) | undefined;

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));

    unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: EventItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<EventItem, "id">),
        start: doc.data().startTime, // Map startTime to start
        end: doc.data().endTime, // Map endTime to end
      }));
      setEvents(fetched);
    });

    return () => {
      if(unsubscribe) unsubscribe();
    };
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
        start: editedEvent.start, // Save start time
        end: editedEvent.end, // Save end time
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

  const handleNavigateToDashboard = (eventId: string) => {
    router.push({ pathname: "/events/eventdashboard", params: { eventId } });
  };

  const handleLogout = () => {
    if (unsubscribe) unsubscribe(); // Unsubscribe from Firestore listener
    signOut(auth)
      .then(() => {
        Alert.alert("Logout", "You have been logged out.", [
          {
            text: "OK",
            onPress: () => router.push("/login"),
          },
        ]);
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        Alert.alert("Error", "Failed to logout. Please try again.");
      });
  };

  const renderItem = ({ item }: { item: EventItem }) => {
    const isEditing = currentlyEditingId === item.id;

    const formatTime = (time: string) => {
      const date = new Date(time);
      return format(date, "hh:mm a");
    };

    return (
      <Card style={styles.eventCard}>
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
              <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                <TextInput
                  value={
                    editedEvent.date
                      ? new Date(editedEvent.date).toLocaleDateString()
                      : ""
                  }
                  editable={false} // Disable manual typing
                  style={styles.input}
                  placeholder="Date"
                  pointerEvents="none" // Prevent touch events on the TextInput
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={
                  editedEvent.date ? new Date(editedEvent.date) : new Date()
                }
                onConfirm={(selectedDate) => {
                  setEditedEvent((prev) => ({
                    ...prev,
                    date: selectedDate.toISOString(),
                  }));
                  setDatePickerVisible(false);
                }}
                onCancel={() => setDatePickerVisible(false)}
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
              <TouchableOpacity onPress={showStartTimePicker}>
                <TextInput
                  value={
                    editedEvent.start
                      ? new Date(editedEvent.start).toLocaleTimeString()
                      : ""
                  }
                  editable={false} // Disable manual typing
                  style={styles.input}
                  placeholder="Start Time"
                  pointerEvents="none" // Prevent touch events on the TextInput
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isStartTimePickerVisible}
                mode="time"
                date={
                  editedEvent.start ? new Date(editedEvent.start) : new Date()
                }
                onConfirm={handleConfirmStartTime}
                onCancel={hideStartTimePicker}
              />
              <TouchableOpacity onPress={showEndTimePicker}>
                <TextInput
                  value={
                    editedEvent.end
                      ? new Date(editedEvent.end).toLocaleTimeString()
                      : ""
                  }
                  editable={false} // Disable manual typing
                  style={styles.input}
                  placeholder="End Time"
                  pointerEvents="none" // Prevent touch events on the TextInput
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isEndTimePickerVisible}
                mode="time"
                date={editedEvent.end ? new Date(editedEvent.end) : new Date()}
                onConfirm={handleConfirmEndTime}
                onCancel={hideEndTimePicker}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.saveButton}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentlyEditingId(null); // Cancel editing
                    setEditedEvent({}); // Reset edited event
                  }}
                  style={styles.cancelButton}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.eventDetailsContainer}>
              <TouchableOpacity
                onPress={() => handleNavigateToDashboard(item.id)}
                style={styles.eventDetails}
              >
                <Text style={styles.eventName}>{item.name}</Text>
                <Text style={styles.eventDetail}>Date: {item.date}</Text>
                <Text style={styles.eventDetail}>
                  Location: {item.location}
                </Text>
                <Text style={styles.eventDetail}>Budget: ${item.budget}</Text>
                <Text style={styles.eventDetail}>
                  Start Time: {formatTime(item.start)}
                </Text>
                <Text style={styles.eventDetail}>
                  End Time: {formatTime(item.end)}
                </Text>
              </TouchableOpacity>
              <View style={styles.iconButtonContainer}>
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={styles.iconButton}
                >
                  <MaterialIcons name="edit" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.iconButton}
                >
                  <MaterialIcons name="delete" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Card>
    );
  };

  return (
    <ScreenContainer insideTabs={true}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Event List</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
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
        style={[styles.fab, { bottom: bottomTabBarHeight + 16 }]}
        onPress={() => router.push("/events/createEvent")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center",
    color: "#000",
  },
  subtitle: { fontSize: 16, marginTop: 10, textAlign: "center", color: "gray" },
  listContainer: { padding: 20 },
  eventItem: {
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
  cancelButton: {
    backgroundColor: "#FF9500",
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
  eventDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventDetails: {
    flex: 1,
  },
  eventDetail: {
    fontSize: 14,
    color: "#666",
  },
  iconButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 10,
  },
  eventCard: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 30,
  },
  logoutButton: {
    padding: 8,
  },
});
