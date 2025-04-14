import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import ScreenContainer from "@/components/ScreenContainer";

export default function VendorDiscoveryScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [vendors, setVendors] = useState<{ id: string; type?: string; budgetRange?: string; location?: string; eventTypes?: string[]; name?: string; rating?: number }[]>([]);
  const [filters, setFilters] = useState({
    type: "",
    budgetRange: "",
    location: "",
    eventType: "",
  });

  useEffect(() => {
    const fetchVendors = async () => {
      const vendorQuery = query(collection(db, "vendors"));
      const snapshot = await getDocs(vendorQuery);
      const fetchedVendors = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVendors(fetchedVendors);
    };

    fetchVendors();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredVendors = vendors.filter((vendor) => {
    return (
      (!filters.type || vendor.type.includes(filters.type)) &&
      (!filters.budgetRange || vendor.budgetRange === filters.budgetRange) &&
      (!filters.location || vendor.location.includes(filters.location)) &&
      (!filters.eventType || vendor.eventTypes.includes(filters.eventType))
    );
  });

  return (
    <ScreenContainer insideTabs={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Discover Vendors</Text>

        <TextInput
          style={styles.input}
          placeholder="Vendor Type"
          value={filters.type}
          onChangeText={(text) => handleFilterChange("type", text)}
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
        <TextInput
          style={styles.input}
          placeholder="Event Type"
          value={filters.eventType}
          onChangeText={(text) => handleFilterChange("eventType", text)}
        />

        <FlatList
          data={filteredVendors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.vendorCard}
              onPress={() =>
                router.push(
                  `/events/vendordetail?vendorId=${item.id}&eventId=${eventId}`
                )
              }
            >
              <Text style={styles.vendorName}>{item.name}</Text>
              <Text>Type: {item.type}</Text>
              <Text>Budget: {item.budgetRange}</Text>
              <Text>Rating: {item.rating}</Text>
              <Text>Location: {item.location}</Text>
            </TouchableOpacity>
          )}
        />
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
});
