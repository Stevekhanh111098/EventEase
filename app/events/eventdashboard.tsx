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
} from "firebase/firestore";
import { db } from "@/firebase";
import { ProgressBar } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { format } from "date-fns";
import { router } from "expo-router";
import ScreenContainer from "@/components/ScreenContainer";
import { Card } from "react-native-paper";

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
  console.log("EventDashboard component loaded");

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
        console.log("Fetched guestList:", data.guestList);
        setGuestList(data.guestList || []);
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

    return () => {
      unsubscribeEvent();
      unsubscribeExpenses();
      unsubscribeTasks();
    };
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

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  const pieChartData = Object.keys(categoryData).map((category) => ({
    name: category,
    amount: categoryData[category],
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  const progress = totalBudget > 0 ? totalSpent / totalBudget : 0;

  const navigateToAddGuest = () =>
    router.push(`/events/addguest?eventId=${eventId}`);
  const navigateToAddExpense = () =>
    router.push(`/events/addexpense?eventId=${eventId}`);
  const navigateToAddTask = () =>
    router.push(`/events/addtask?eventId=${eventId}`);

  return (
    <ScreenContainer insideTabs={false}>
      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.container}>
          {eventDetails && (
            <Card style={styles.card}>
              <View>
                <Text style={styles.title}>{eventDetails.name}</Text>
                <Text>Date: {eventDetails.date}</Text>
                <Text>Location: {eventDetails.location}</Text>
                <Text>Budget: ${eventDetails.budget}</Text>
              </View>
            </Card>
          )}

          <Card style={styles.card}>
            <Text style={styles.subtitle}>Guest List</Text>
            {guestList.map((item, index) => (
              <View key={index} style={styles.guestItem}>
                <Text>{item.name}</Text>
                <Text>RSVP: {item.rsvp}</Text>
                <Text>Meal: {item.meal}</Text>
                <Text>VIP: {item.vip ? "Yes" : "No"}</Text>
              </View>
            ))}
            <TouchableOpacity
              onPress={navigateToAddGuest}
              style={styles.addButton}
            >
              <Text style={styles.buttonText}>Add Guest</Text>
            </TouchableOpacity>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.subtitle}>Budget Overview</Text>
            <Text>Total Budget: ${totalBudget}</Text>
            <Text>Total Spent: ${totalSpent}</Text>
            <Text>Remaining Budget: ${remainingBudget}</Text>
            <ProgressBar
              progress={progress}
              color="#007AFF"
              style={styles.progressBar}
            />
            <PieChart
              data={pieChartData}
              width={300}
              height={220}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            <TouchableOpacity
              onPress={navigateToAddExpense}
              style={styles.addButton}
            >
              <Text style={styles.buttonText}>Add Expense</Text>
            </TouchableOpacity>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.subtitle}>Task List</Text>
            {tasks.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <Text>{task.title}</Text>
                <Text>
                  Deadline:{" "}
                  {task.deadline && task.deadline.toDate
                    ? format(task.deadline.toDate(), "MMM dd, yyyy")
                    : "N/A"}
                </Text>
                <Text>
                  Status: {task.isCompleted ? "Completed" : "Pending"}
                </Text>
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
                    style={styles.completeButton}
                  >
                    <Text style={styles.buttonText}>Mark as Completed</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <View style={styles.progressContainer}>
              <Text>Task Progress</Text>
              <ProgressBar
                progress={
                  tasks.length > 0
                    ? tasks.filter((task) => task.isCompleted).length /
                      tasks.length
                    : 0
                }
                color="#007AFF"
                style={styles.progressBar}
              />
              <Text>
                {tasks.filter((task) => task.isCompleted).length} /{" "}
                {tasks.length} tasks completed
              </Text>
            </View>
            <TouchableOpacity
              onPress={navigateToAddTask}
              style={styles.addButton}
            >
              <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
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
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: "#FF3B30",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#007AFF",
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
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  progressBar: { height: 10, borderRadius: 5, marginTop: 10 },
  expenseItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  taskItem: {
    backgroundColor: "#f9f9f9",
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
});
