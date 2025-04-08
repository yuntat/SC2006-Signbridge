import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import Button from '../components/Button';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'xxx@example.com' && password === 'password123') {
      navigation.navigate('Main');
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button large text="Sign In" onPress={handleLogin} />
      <Button small text="Sign Up" onPress={() => Alert.alert('Sign Up', 'Feature coming soon!')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 15,
    borderRadius: 5,
  },
});