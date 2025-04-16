import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { ProgressBar } from "react-native-paper";
import { PieChart } from "react-native-gifted-charts";
import { format } from "date-fns";
import { router } from "expo-router";
import ScreenContainer from "@/components/ScreenContainer";
import { Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

type EventDetails = {
  name: string;
  date: string;
  location: string;
  budget: number;
  guestList: Guest[];
};

type Guest = {
  name: string;
  rsvp: string;
  meal: string;
  vip: boolean;
};

export default function EventDashboard() {
  const { eventId } = useLocalSearchParams();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [guestList, setGuestList] = useState<Guest[]>([]);
  const [newGuest, setNewGuest] = useState<Guest>({
    name: "",
    rsvp: "",
    meal: "",
    vip: false,
  });
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: "",
  });
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    deadline: "",
    isCompleted: false,
  });
  const [selectedVendors, setSelectedVendors] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [rsvpData, setRSVPData] = useState<any[]>([]);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

  useEffect(() => {
    if (!eventId || typeof eventId !== "string") return;

    const eventRef = doc(db, "events", eventId);
    const unsubscribeEvent = onSnapshot(eventRef, (doc) => {
      const data = doc.data();
      if (data) {
        setEventDetails({
          name: data.name,
          date: data.date,
          location: data.location,
          budget: data.budget,
          guestList: data.guestList || [],
        });
        setTotalBudget(data.budget || 0);
      }
    });

    const expensesQuery = query(
      collection(db, "expenses"),
      where("eventId", "==", eventId)
    );
    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const fetchedExpenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(fetchedExpenses);
    });

    const tasksQuery = query(
      collection(db, "tasks"),
      where("eventId", "==", eventId)
    );
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    });

    const vendorsQuery = query(
      collection(db, "eventVendors"),
      where("eventId", "==", eventId)
    );
    const unsubscribeVendors = onSnapshot(vendorsQuery, async (snapshot) => {
      const fetchedVendorIds = snapshot.docs.map((doc) => doc.data().vendorId);

      if (fetchedVendorIds.length > 0) {
        // Query the "vendors" collection to get all matching vendor objects in a single query
        const vendorsQuery = query(
          collection(db, "vendors"),
          where("id", "in", fetchedVendorIds)
        );
        const vendorSnapshot = await getDocs(vendorsQuery);
        const vendorDocs = vendorSnapshot.docs.map((doc) => doc.data());

        setSelectedVendors(vendorDocs); // Set the fetched vendor objects
      } else {
        setSelectedVendors([]); // No vendors found
        console.log("No vendors found for this event.");
      }
    });

    return () => {
      unsubscribeEvent();
      unsubscribeExpenses();
      unsubscribeTasks();
      unsubscribeVendors();
    };
  }, [eventId]);

  const fetchRSVPData = async () => {
    try {
      const rsvpsRef = collection(db, "rsvps");
      const q = query(rsvpsRef, where("eventId", "==", eventId));
      const querySnapshot = await getDocs(q);

      const rsvpData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRSVPData(rsvpData);
    } catch (error) {
      console.error("Failed to fetch RSVP data:", error);
    }
  };

  useEffect(() => {
    fetchRSVPData();
  }, [eventId]);

  const fetchGuestList = async () => {
    try {
      const guestListRef = collection(db, "guestLists");
      const q = query(guestListRef, where("eventId", "==", eventId));
      const querySnapshot = await getDocs(q);

      const guests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGuestList(guests);
    } catch (error) {
      console.error("Failed to fetch guest list:", error);
    }
  };

  useEffect(() => {
    fetchGuestList();
  }, [eventId]);

  const handleAddGuest = async () => {
    if (!newGuest.name.trim()) {
      Alert.alert("Error", "Guest name is required.");
      return;
    }

    const updatedGuestList = [...guestList, newGuest];

    try {
      if (eventId && typeof eventId === "string") {
        await updateDoc(doc(db, "events", eventId), {
          guestList: updatedGuestList,
        });
        setNewGuest({ name: "", rsvp: "", meal: "", vip: false });
      }
    } catch (error) {
      console.error("Failed to add guest:", error);
    }
  };

  const handleRemoveGuest = async (index: number) => {
    const updatedGuestList = guestList.filter((_, i) => i !== index);

    try {
      if (eventId && typeof eventId === "string") {
        await updateDoc(doc(db, "events", eventId), {
          guestList: updatedGuestList,
        });
      }
    } catch (error) {
      console.error("Failed to remove guest:", error);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.category || !newExpense.amount) {
      Alert.alert("Error", "Category and amount are required.");
      return;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        eventId,
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        createdAt: new Date(),
      });
      setNewExpense({ category: "", amount: "", description: "" });
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.deadline) {
      Alert.alert("Error", "Title and deadline are required.");
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        eventId,
        title: newTask.title,
        deadline: new Date(newTask.deadline),
        isCompleted: newTask.isCompleted,
      });
      setNewTask({ title: "", deadline: "", isCompleted: false });
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleToggleTaskCompletion = async (
    taskId: string,
    isCompleted: boolean
  ) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), { isCompleted: !isCompleted });
    } catch (error) {
      console.error("Failed to update task completion:", error);
    }
  };

  const handleSelectVendor = async (vendorId) => {
    try {
      const selectedVendor = vendors.find((vendor) => vendor.id === vendorId);
      if (!selectedVendor) {
        Alert.alert("Error", "Vendor not found.");
        return;
      }

      const updatedSelectedVendors = [...selectedVendors, selectedVendor];
      setSelectedVendors(updatedSelectedVendors);

      await addDoc(collection(db, "eventVendors"), {
        eventId,
        vendorId,
        status: "selected",
      });

      Alert.alert("Success", "Vendor selected successfully.");
    } catch (error) {
      console.error("Failed to select vendor:", error);
      Alert.alert("Error", "Failed to select vendor.");
    }
  };

  const handleRemoveVendor = async (vendorId) => {
    try {
      const updatedSelectedVendors = selectedVendors.filter(
        (vendor) => vendor.id !== vendorId
      );
      setSelectedVendors(updatedSelectedVendors);

      const vendorDoc = query(
        collection(db, "eventVendors"),
        where("eventId", "==", eventId),
        where("vendorId", "==", vendorId)
      );

      console.log("Vendor Doc Query:", eventId, vendorId);
      const snapshot = await getDocs(vendorDoc);

      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      Alert.alert("Success", "Vendor removed successfully.");
    } catch (error) {
      console.error("Failed to remove vendor:", error);
      Alert.alert("Error", "Failed to remove vendor.");
    }
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  const pieChartItems = Object.keys(categoryData).map((category) => ({
    text: category + " - $" + categoryData[category],
    value: categoryData[category],
    // color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    textColor: "#000000",
  }));

  const progress = totalBudget > 0 ? totalSpent / totalBudget : 0;

  const navigateToAddGuest = () =>
    router.push(`/events/addguest?eventId=${eventId}`);
  const navigateToAddExpense = () =>
    router.push(`/events/addexpense?eventId=${eventId}`);
  const navigateToAddTask = () =>
    router.push(`/events/addtask?eventId=${eventId}`);

  const handleSelectVendors = (eventId) => {
    router.push(`/events/selectVendor?eventId=${eventId}`);
  };

  return (
    <ScreenContainer
      insideTabs={false}
      style={{ backgroundColor: themedColors.background }}
    >
      <ScrollView nestedScrollEnabled={true}>
        <View
          style={[
            styles.container,
            { backgroundColor: themedColors.background },
          ]}
        >
          {eventDetails && (
            <Card
              style={[styles.card, { backgroundColor: themedColors.surface }]}
            >
              <View>
                <Text style={[styles.title, { color: themedColors.primary }]}>
                  {eventDetails.name}
                </Text>
                <Text style={{ color: themedColors.text }}>
                  Date: {eventDetails.date}
                </Text>
                <Text style={{ color: themedColors.text }}>
                  Location: {eventDetails.location}
                </Text>
                <Text style={{ color: themedColors.text }}>
                  Budget: ${eventDetails.budget}
                </Text>
              </View>
            </Card>
          )}

          <Card
            style={[styles.card, { backgroundColor: themedColors.surface }]}
          >
            <Text style={[styles.subtitle, { color: themedColors.primary }]}>
              Guest List
            </Text>
            <Text style={{ color: themedColors.text }}>
              {guestList
                .filter((guest) => guest.rsvp === "Yes")
                .map((guest) => guest.name)
                .join(", ") || "No guests"}{" "}
              are coming.
            </Text>
            {guestList.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.guestItem,
                  { backgroundColor: themedColors.background },
                ]}
              >
                <Text style={{ color: themedColors.text }}>{item.name}</Text>
                <Text style={{ color: themedColors.text }}>
                  RSVP: {item.rsvp}
                </Text>
                <Text style={{ color: themedColors.text }}>
                  Meal: {item.meal}
                </Text>
                <Text style={{ color: themedColors.text }}>
                  VIP: {item.vip ? "Yes" : "No"}
                </Text>
              </View>
            ))}
            <TouchableOpacity
              onPress={navigateToAddGuest}
              style={[
                styles.addButton,
                { backgroundColor: themedColors.primary },
              ]}
            >
              <Text
                style={[styles.buttonText, { color: themedColors.background }]}
              >
                Add Guest
              </Text>
            </TouchableOpacity>
          </Card>

          <Card
            style={[styles.card, { backgroundColor: themedColors.surface }]}
          >
            <Text style={[styles.subtitle, { color: themedColors.primary }]}>
              Budget Overview
            </Text>
            <Text style={{ color: themedColors.text }}>
              Total Budget: ${totalBudget}
            </Text>
            <Text style={{ color: themedColors.text }}>
              Total Spent: ${totalSpent}
            </Text>
            <Text style={{ color: themedColors.text }}>
              Remaining Budget: ${remainingBudget}
            </Text>
            <ProgressBar
              progress={progress}
              color={themedColors.primary}
              style={styles.progressBar}
            />
            <PieChart
              data={pieChartItems.map((item, idx) => ({
                ...item,
                color: themedColors.brandColors
                  ? themedColors.brandColors[
                      idx % themedColors.brandColors.length
                    ]
                  : themedColors.accent,
                textColor: themedColors.text,
              }))}
              radius={100}
              showText={true}
              textColor={themedColors.text}
              textSize={12}
              focusOnPress={true}
              labelsPosition="mid"
              strokeWidth={1}
              strokeColor={themedColors.border}
            />
            <TouchableOpacity
              onPress={navigateToAddExpense}
              style={[
                styles.addButton,
                { backgroundColor: themedColors.primary },
              ]}
            >
              <Text
                style={[styles.buttonText, { color: themedColors.background }]}
              >
                Add Expense
              </Text>
            </TouchableOpacity>
          </Card>

          <Card
            style={[styles.card, { backgroundColor: themedColors.surface }]}
          >
            <Text style={[styles.subtitle, { color: themedColors.primary }]}>
              Task List
            </Text>
            {tasks.map((task, index) => (
              <View
                key={index}
                style={[
                  styles.taskItem,
                  { backgroundColor: themedColors.background },
                ]}
              >
                <Text style={{ color: themedColors.text }}>{task.title}</Text>
                <Text style={{ color: themedColors.text }}>
                  Deadline:{" "}
                  {task.deadline && task.deadline.toDate
                    ? format(task.deadline.toDate(), "MMM dd, yyyy")
                    : "N/A"}
                </Text>
                <View style={styles.taskDetailsContainer}>
                  <Text style={{ color: themedColors.text }}>
                    Status: {task.isCompleted ? "Completed" : "Pending"}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {!task.isCompleted && (
                      <TouchableOpacity
                        onPress={async () => {
                          try {
                            await updateDoc(doc(db, "tasks", task.id), {
                              isCompleted: true,
                            });
                          } catch (error) {
                            console.error(
                              "Failed to mark task as completed:",
                              error
                            );
                          }
                        }}
                        style={styles.iconButton}
                      >
                        <MaterialIcons
                          name="check-circle"
                          size={32}
                          color={themedColors.primary}
                        />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={async () => {
                        try {
                          await deleteDoc(doc(db, "tasks", task.id));
                        } catch (error) {
                          console.error("Failed to delete task:", error);
                        }
                      }}
                      style={styles.iconButton}
                    >
                      <MaterialIcons
                        name="delete"
                        size={32}
                        color={themedColors.accent}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.progressContainer}>
              <Text style={{ color: themedColors.text }}>Task Progress</Text>
              <ProgressBar
                progress={
                  tasks.length > 0
                    ? tasks.filter((task) => task.isCompleted).length /
                      tasks.length
                    : 0
                }
                color={themedColors.primary}
                style={styles.progressBar}
              />
              <Text style={{ color: themedColors.text }}>
                {tasks.filter((task) => task.isCompleted).length} /{" "}
                {tasks.length} tasks completed
              </Text>
            </View>
            <TouchableOpacity
              onPress={navigateToAddTask}
              style={[
                styles.addButton,
                { backgroundColor: themedColors.primary },
              ]}
            >
              <Text
                style={[styles.buttonText, { color: themedColors.background }]}
              >
                Add Task
              </Text>
            </TouchableOpacity>
          </Card>

          <Card
            style={[styles.card, { backgroundColor: themedColors.surface }]}
          >
            <Text style={[styles.subtitle, { color: themedColors.primary }]}>
              Selected Vendors
            </Text>
            {selectedVendors.length === 0 && (
              <Text style={{ color: themedColors.text }}>
                No vendors selected for this event.
              </Text>
            )}
            {selectedVendors.map((vendor, index) => (
              <View
                key={index}
                style={[
                  styles.vendorItem,
                  { backgroundColor: themedColors.background },
                ]}
              >
                <Text style={{ color: themedColors.text }}>{vendor.name}</Text>
                <Text style={{ color: themedColors.text }}>
                  Status: Booked
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveVendor(vendor.id)}
                  style={[
                    styles.removeButton,
                    { backgroundColor: themedColors.accent },
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: themedColors.background },
                    ]}
                  >
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={() => handleSelectVendors(eventId)}
              style={[
                styles.selectVendorsButton,
                { backgroundColor: themedColors.primary },
              ]}
            >
              <Text
                style={[styles.buttonText, { color: themedColors.background }]}
              >
                Select Vendors
              </Text>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  guestItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  removeButton: {
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  vipButton: {
    backgroundColor: "#FF9500",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { textAlign: "center", fontWeight: "bold" },
  progressBar: { height: 10, borderRadius: 5, marginTop: 10 },
  expenseItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  taskItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  completedButton: {
    backgroundColor: "#4CD964",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  incompleteButton: {
    backgroundColor: "#FF9500",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: "#4CD964",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  progressContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
    padding: 10,
  },
  vendorItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  vendorCard: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  vendorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  vendorType: {
    fontSize: 14,
    color: "#666",
  },
  vendorDetail: {
    fontSize: 14,
    color: "#333",
  },
  selectButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  selectVendorsButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  iconButton: {
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  taskDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
