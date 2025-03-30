import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import EventForm from '../../components/EventForm';

const EventCreationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Create New Event</Text>
      <EventForm />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default EventCreationScreen;
