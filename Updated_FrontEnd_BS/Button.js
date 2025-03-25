import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ text, large, small, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        large && styles.large,
        small && styles.small,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  large: {
    width: '100%',
  },
  small: {
    width: '50%',
    alignSelf: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});