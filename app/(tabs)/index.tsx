import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Replace the Text with an Image */}
      <Image
        source={require('../../logo/logo-color.png')} // Adjust the path to your image
        style={styles.image} // Style the image as needed
      />
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
    width: 200,   // Adjust the width
    height: 200,  // Adjust the height
    resizeMode: 'contain', // Ensure the image scales properly
  },
});
