import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Button from '../components/Button';

export default function Main() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Button large text="Live Video Translation" />
      <Button large text="Pre-recorded Video Upload" />
      <Button large text="Text-to-Sign Conversion" />
      <Button small text="Settings" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
});