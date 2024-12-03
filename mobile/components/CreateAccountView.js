import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import { createUser, loginUser } from '../service/authService'; // Import the createUser function
import { uploadProfilePic } from '../service/fileService';
import { AuthContext } from '../context/AuthContext';


/**
 * CreateAccountView component handles the user account creation process.
 * 
 * This component manages a multi-step form for creating a new user account. It includes input fields for user details,
 * navigation between steps, and submission of the form data. The component also allows the user to pick a profile picture
 * from their device's image library.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.navigation - The navigation object provided by React Navigation.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function CreateAccountView({ navigation }) {
  const { login } = useContext(AuthContext);
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
    setFormData({ ...formData, [name]: sanitizeInput(value) });
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
    try {
      console.log("test");
      const userData = await createUser(formData);            //this maeks a user 
      console.log("CREATE USER RESPONSE: " + JSON.stringify(userData, null, 2));
      const loginData = await loginUser(formData.username, formData.password); //this logs in the user | this is a lazy fix for that bug
      console.log("LOGIN RESPONSE: " + JSON.stringify(loginData, null, 2));
      login(loginData); // saving user data in context and AsyncStorage
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
              onChangeText={(text) => handleInputChange('email', text)}
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
