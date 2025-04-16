import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams, Redirect } from "expo-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import ScreenContainer from "@/components/ScreenContainer";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { useFocusEffect } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

export default function VendorDiscoveryScreen() {
  const router = useRouter();

  const [vendors, setVendors] = useState<
    {
      id: string;
      type?: string;
      budgetRange?: string;
      location?: string;
      eventTypes?: string[];
      name?: string;
      rating?: number;
    }[]
  >([]);
  const [filters, setFilters] = useState({
    type: "",
    budgetRange: "",
    location: "",
    eventType: "",
  });

  const [filterType, setFilterType] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterItems] = useState([
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

  const [filterEventOpen, setFilterEventOpen] = useState(false);
  const [eventTypeItems] = useState([
    { label: "Wedding", value: "wedding" },
    { label: "Birthday", value: "birthday" },
    { label: "Corporate", value: "corporate" },
    { label: "Concert", value: "concert" },
    { label: "Festival", value: "festival" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const fetchVendors = async () => {
        const vendorQuery = query(collection(db, "vendors"));
        const snapshot = await getDocs(vendorQuery);
        const fetchedVendors = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVendors(fetchedVendors);
        console.log("Fetched vendors:", fetchedVendors);
      };

      fetchVendors();
    }, [])
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredVendors = vendors.filter((vendor) => {
    return (
      (!filterType || vendor.type === filterType) &&
      (!filters.type || vendor.type.includes(filters.type)) &&
      (!filters.budgetRange || vendor.budgetRange === filters.budgetRange) &&
      (!filters.location || vendor.location.includes(filters.location)) &&
      (!filters.eventType || vendor.eventTypes.includes(filters.eventType)) &&
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleVendorClick = (vendorId) => {
    router.push(`/events/vendorDetail?vendorId=${vendorId}`);
  };

  return (
    <ScreenContainer insideTabs={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Discover Vendors</Text>

        <DropDownPicker
          open={filterOpen}
          value={filterType}
          items={filterItems}
          setOpen={setFilterOpen}
          setValue={setFilterType}
          placeholder="Filter by Vendor Type"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        <TextInput
          style={styles.input}
          placeholder="Budget Range"
          value={filters.budgetRange}
          onChangeText={(text) => handleFilterChange("budgetRange", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={filters.location}
          onChangeText={(text) => handleFilterChange("location", text)}
        />
        <DropDownPicker
          open={filterEventOpen}
          value={filters.eventType}
          items={eventTypeItems}
          setOpen={setFilterEventOpen}
          setValue={(callback) =>
            setFilters((prev) => ({
              ...prev,
              eventType: callback(prev.eventType),
            }))
          }
          placeholder="Filter by Event Type"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        <TextInput
          style={styles.input}
          placeholder="Search Vendors"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredVendors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleVendorClick(item.id)}
              style={styles.vendorCard}
            >
              <Text style={styles.vendorName}>{item.name}</Text>
              <Text style={styles.vendorDetail}>Type: {item.type}</Text>
              <Text style={styles.vendorDetail}>
                Budget: {item.budgetRange}
              </Text>
              <Text style={styles.vendorDetail}>Rating: {item.rating} ⭐</Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/events/addVendors")}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
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
  vendorCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  vendorName: { fontSize: 18, fontWeight: "bold" },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  dropdownContainer: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
