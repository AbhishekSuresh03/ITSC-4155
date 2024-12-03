import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loginUser } from '../service/authService';
import { AuthContext } from '../context/AuthContext';
import { sanitizeInput, validateEmail, validatePassword } from '../utils/sanitize.js';

export default function LoginAccountView({ navigation }) {
  const { login } = useContext(AuthContext); // Access login function from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email, 'email');
    const sanitizedPassword = sanitizeInput(password, 'password');

    // Validate inputs
    if (!sanitizedEmail || !sanitizedPassword) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(sanitizedPassword)) {
      Alert.alert(
        'Invalid Password',
        'Password should be 8-50 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    try {
      const userData = await loginUser(sanitizedEmail, sanitizedPassword); // Call backend to login
      login(userData); // Save user data in context and AsyncStorage
      navigation.navigate('Main');
    } catch (error) {
      console.error('Login account error:', error.message); // Log to the console
      Alert.alert('Login Failed', error.message); // Display error on the phone
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(sanitizeInput(text, 'email'))}
        maxLength={50}
      />

      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={userName}
        onChangeText={(text) => setUserName(sanitizeInput(text))} // Sanitize input as the user types
        maxLength={20}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(sanitizeInput(text))} // Sanitize input as the user types
        maxLength={50}
      />

      <Button title="Submit" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.link}>Create New Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  link: {
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
  },
});
