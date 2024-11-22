import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import { createUser } from '../service/authService'; // Import the createUser function
import { uploadProfilePic } from '../service/fileService';
import {
  sanitizeInput,
  validateUsername,
  validateEmail,
  validatePassword,
  validateName
} from '../utils/sanitize.js';

export default function CreateAccountView({ navigation }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    email: '',
    password: '',
    profilePicture: '',
  });

  const handleInputChange = (name, value) => {
    const sanitizedValue = sanitizeInput(value, name === 'email' ? 'email' : name === 'password' ? 'password' : '');
    setFormData({ ...formData, [name]: sanitizedValue });
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.navigate('OpeningPage');
    }
  };

  const handleSubmit = async () => {
    const { username, firstName, lastName, email, password } = formData;

    // Validate inputs
    if (!username || !firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (!validateUsername(username)) {
      Alert.alert('Invalid Username', 'Username should be 3-20 alphanumeric characters.');
      return;
    }

    if (!validateName(firstName) || !validateName(lastName)) {
      Alert.alert('Invalid Name', 'Names should only contain letters, spaces, and hyphens.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Invalid Password',
        'Password should be 8-50 characters, with at least one uppercase letter, one lowercase letter, and one number.'
      );
      return;
    }

    try {
      const userData = await createUser(formData);
      navigation.navigate('Main');
      console.log(userData);
    } catch (error) {
      console.error('Create account error:', error.message);
      Alert.alert('Account could not be created', error.message);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const downloadURL = await uploadProfilePic(result.assets[0].uri);
      setFormData({ ...formData, profilePicture: downloadURL });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={formData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={formData.username}
              onChangeText={(text) => handleInputChange('username', text)}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="City"
              value={formData.city}
              onChangeText={(text) => handleInputChange('city', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={formData.state}
              onChangeText={(text) => handleInputChange('state', text)}
            />
          </View>
        );
      case 5:
        return (
          <View style={styles.inputContainer}>
            {formData.profilePicture && (
              <Image source={{ uri: formData.profilePicture }} style={styles.image} />
            )}
            <Button title="Pick a Profile Picture" onPress={pickImage} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Progress.Bar progress={step / 5} width={null} color="#FFC107" style={styles.progressBar} />
      {renderStep()}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>{step === 5 ? 'Submit' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  progressBar: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  nextButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
  },
});
