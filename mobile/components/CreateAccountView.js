import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Alert, RootTagContext} from 'react-native';
import { createUser } from '../service/authService'; // Adjust the import path as needed


export default function CreateAccountView({ navigation }){
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleCreateAccount = async () => {
        try{
            const userData = await createUser(email, username, firstName, lastName, password);
            navigation.navigate('Main');
            console.log(userData);
        } catch(error){
            console.error('Create account error:', error.message); // This will log to the browser console
            Alert.alert('Account could not be created', error.message);
        }
        
    };
    

    return(
        <View style={styles.container}>
            <Text style={styles.title}> Create Account </Text>
            
            <TextInput
                style={styles.input}
                placeholder="User Name"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />

            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button title="Submit" onPress={handleCreateAccount} />

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Log in here</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#fff',
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