import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Replace the Text with an Image */}
      <Image
        source={require('../../logo/logo-color.png')} // Adjust the path to your image
        style={styles.image} // Style the image as needed
      />
      <Link href="/login">Go to Login Page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 300,   // Adjust the width
    height: 300,  // Adjust the height
    resizeMode: 'contain', // Ensure the image scales properly
  },
  link: {
    color: '#11181C',
    fontWeight: 'bold',
  },
});
