import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loginUser } from '../service/authService'; 
import { AuthContext } from '../context/AuthContext';


export default function LoginAccountView({ navigation }) {
  const { login } = useContext(AuthContext); //use login function from AuthContext
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  // sanitize and trim
  const sanitizeInput = (input) => {
    return input.replace(/[^\w\s]/gi, '').trim();
  };

  // validate username and password format
  const isUsernameValid = (userName) => {
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/; // alphanumeric, 3-20 characters
    return usernameRegex.test(userName);
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,50}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async () => {
    const sanitizedUserName = sanitizeInput(userName);
    const sanitizedPassword = sanitizeInput(password);

    // validate before making request
    if (!sanitizedUserName || !sanitizedPassword) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      const userData = await loginUser(sanitizedUserName, sanitizedPassword); //calling backend to login
      login(userData); // saving user data in context and AsyncStorage
      navigation.navigate('Main');
    } catch (error) {
      console.error('Login account error:', error.message); // This will log to the browser console
      Alert.alert('Login Failed', error.message); // this will log error on the phone
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Log In </Text>

      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={userName}
        onChangeText={(text) => setUserName(sanitizeInput(text))}
        maxLength={20}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(sanitizeInput(text))}
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