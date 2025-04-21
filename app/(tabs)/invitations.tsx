import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import ScreenContainer from "@/components/ScreenContainer";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/Colors";

export default function InvitationsScreen() {
  const [invitations, setInvitations] = useState([]);
  const router = useRouter();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedColors = Colors[theme];

  useEffect(() => {
    const fetchInvitations = async (email) => {
      const guestListsRef = collection(db, "guestLists");
      const q = query(guestListsRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      const fetchedInvitations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInvitations(fetchedInvitations);
    };

    if (user) {
      fetchInvitations(user.email);
    }
  }, [router, user]);

  const handleRSVP = (invitation) => {
    router.push({
      pathname: "/events/rsvp",
      params: {
        eventId: invitation.eventId,
        guestEmail: invitation.email,
        docId: invitation.id,
      },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.invitationItem, { backgroundColor: themedColors.surface }]}
      onPress={() => handleRSVP(item)}
    >
      <Text style={[styles.invitationText, { color: themedColors.text }]}>
        Event ID: {item.eventId}
      </Text>
      <Text style={[styles.invitationText, { color: themedColors.text }]}>
        Guest Email: {item.email}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer
      insideTabs={true}
      style={{ backgroundColor: themedColors.background }}
    >
      <View
        style={[styles.container, { backgroundColor: themedColors.background }]}
      >
        <Text style={[styles.title, { color: themedColors.primary }]}>
          Your Invitations
        </Text>
        {invitations.length === 0 ? (
          <Text
            style={[
              styles.noInvitationsText,
              { color: themedColors.secondary },
            ]}
          >
            No invitations found.
          </Text>
        ) : (
          <FlatList
            data={invitations}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  invitationItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  invitationText: {
    fontSize: 16,
  },
  noInvitationsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
