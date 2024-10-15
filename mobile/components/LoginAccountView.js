import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { loginUser } from '../service/authService'; // Adjust the import path as needed


export default function LoginAccountView({ navigation }){
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
      try{
        const userData = await loginUser(userName, password);
        console.log(userData);
        navigation.navigate('Main');
      } catch(error){
        console.error('Login account error:', error.message); // This will log to the browser console
        Alert.alert('Login Failed', error.message); // this will log error on the phone
      }
    };

    return(
        <View style={styles.container}>
            <Text style={styles.title}> Log In </Text>

            <TextInput
                style={styles.input}
                placeholder="User Name"
                value={userName}
                onChangeText={setUserName}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
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