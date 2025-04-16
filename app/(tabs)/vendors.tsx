import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import ScreenContainer from "@/components/ScreenContainer";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { useFocusEffect } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

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

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

  return (
    <ScreenContainer insideTabs={true}>
      <View
        style={[styles.container, { backgroundColor: themedColors.background }]}
      >
        <Text style={[styles.title, { color: themedColors.primary }]}>
          Discover Vendors
        </Text>
        <DropDownPicker
          open={filterOpen}
          value={filterType}
          items={filterItems}
          setOpen={setFilterOpen}
          setValue={setFilterType}
          placeholder="Filter by Vendor Type"
          style={[
            styles.dropdown,
            {
              backgroundColor: themedColors.surface,
              borderColor: themedColors.border,
            },
          ]}
          dropDownContainerStyle={[
            styles.dropdownContainer,
            {
              backgroundColor: themedColors.surface,
              borderColor: themedColors.border,
            },
          ]}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themedColors.surface,
              borderColor: themedColors.border,
              color: themedColors.text,
            },
          ]}
          placeholder="Budget Range"
          placeholderTextColor={themedColors.text}
          value={filters.budgetRange}
          onChangeText={(text) => handleFilterChange("budgetRange", text)}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themedColors.surface,
              borderColor: themedColors.border,
              color: themedColors.text,
            },
          ]}
          placeholder="Location"
          placeholderTextColor={themedColors.text}
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
          style={[
            styles.dropdown,
            {
              backgroundColor: themedColors.surface,
              borderColor: themedColors.border,
            },
          ]}
          dropDownContainerStyle={[
            styles.dropdownContainer,
            {
              backgroundColor: themedColors.surface,
              borderColor: themedColors.border,
            },
          ]}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themedColors.surface,
              borderColor: themedColors.border,
              color: themedColors.text,
            },
          ]}
          placeholder="Search Vendors"
          placeholderTextColor={themedColors.text}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredVendors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleVendorClick(item.id)}
              style={[
                styles.vendorCard,
                { backgroundColor: themedColors.surface },
              ]}
            >
              <Text style={[styles.vendorName, { color: themedColors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.vendorDetail, { color: themedColors.text }]}>
                Type: {item.type}
              </Text>
              <Text style={[styles.vendorDetail, { color: themedColors.text }]}>
                Budget: {item.budgetRange}
              </Text>
              <Text style={[styles.vendorDetail, { color: themedColors.text }]}>
                Rating: {item.rating} ⭐
              </Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: themedColors.primary }]}
          onPress={() => router.push("/events/addVendors")}
        >
          <Ionicons name="add" size={24} color={themedColors.background} />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  vendorCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  vendorName: { fontSize: 18, fontWeight: "bold" },
  vendorDetail: { fontSize: 14 },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
});
