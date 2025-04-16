import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
}

export default function CustomText({ style, children, ...props }: CustomTextProps) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Palatino', // Apply your desired font family
  },
});