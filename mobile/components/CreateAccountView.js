import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Alert, RootTagContext } from 'react-native';
import { createUser } from '../service/authService'; // Adjust the import path as needed


export default function CreateAccountView({ navigation }) {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // sanitize and trim
    const sanitizeInput = (input) => {
        return input.replace(/[^\w\s]/gi, '').trim();
    };

    // validation
    const isUsernameValid = (username) => /^[a-zA-Z0-9]{3,20}$/.test(username); // alphanumeric, 3-20 characters

    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // basic email format

    const isPasswordValid = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,50}$/.test(password); // at least 1 uppercase, 1 lowercase, 1 number, 8-50 characters


    const handleCreateAccount = async () => {
        // sanitize
        const sanitizedUsername = sanitizeInput(username);
        const sanitizedFirstName = sanitizeInput(firstName);
        const sanitizedLastName = sanitizeInput(lastName);
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPassword = sanitizeInput(password);

        // validate
        if (!sanitizedUsername || !sanitizedFirstName || !sanitizedLastName || !sanitizedEmail || !sanitizedPassword) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        if (!isUsernameValid(sanitizedUsername)) {
            Alert.alert('Invalid Username', 'Username should be 3-20 alphanumeric characters.');
            return;
        }

        if (!isEmailValid(sanitizedEmail)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        if (!isPasswordValid(sanitizedPassword)) {
            Alert.alert(
                'Invalid Password',
                'Password should be 8-50 characters, with at least one uppercase letter, one lowercase letter, and one number.'
            );
            return;
        }

        try {
            const userData = await createUser(sanitizedEmail, sanitizedUsername, sanitizedFirstName, sanitizedLastName, sanitizedPassword);
            navigation.navigate('Main');
            console.log(userData);
        } catch (error) {
            console.error('Create account error:', error.message); // This will log to the browser console
            Alert.alert('Account could not be created', error.message);
        }

    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}> Create Account </Text>

            <TextInput
                style={styles.input}
                placeholder="User Name"
                value={username}
                onChangeText={(text) => setUsername(sanitizeInput(text))}
                maxLength={20}
            />

            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={(text) => setFirstName(sanitizeInput(text))}
            />

            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={(text) => setLastName(sanitizeInput(text))}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text.trim())}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={(text) => setPassword(sanitizeInput(text))}
                maxLength={50}
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