import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import { createUser } from '../service/authService'; // Import the createUser function
import { uploadProfilePic } from '../service/fileService';

export default function CreateAccountView({ navigation }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    birthday: '',
    email: '',
    password: '',
    profilePicture: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
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
      navigation.navigate('OpeningPage'); // Navigate back to the opening page
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userData = await createUser(formData);
      navigation.navigate('Main');
      console.log(userData);
    } catch (error) {
      console.error('Create account error:', error.message);
      Alert.alert('Account could not be created', error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    console.log('Pick image button pressed');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Set aspect ratio to 1:1 for a square crop
      quality: 1,
    });

    console.log('Image picker result:', result);

    if (!result.canceled) {
      setLoading(true);
      try {
        console.log('Image picked:', result.assets[0].uri);
        const downloadURL = await uploadProfilePic(result.assets[0].uri);
        setFormData({ ...formData, profilePicture: downloadURL });
      } catch (error) {
        console.error('Image upload error:', error.message);
        Alert.alert('Image could not be uploaded', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Image picking canceled');
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

  const getMotivatingText = () => {
    switch (step) {
      case 1:
        return "Let's start with your name!";
      case 2:
        return "What's your email address?";
      case 3:
        return "Create a strong password!";
      case 4:
        return "Where are you from?";
      case 5:
        return "Add a profile picture!";
      default:
        return "You're almost there! Keep going!";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Progress.Bar progress={step / 5} width={null} color="#FFC107" style={styles.progressBar} />
      <Text style={styles.motivatingText}>{getMotivatingText()}</Text>
      {renderStep()}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>{step === 5 ? "Submit" : "Next"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  progressBar: {
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  motivatingText: {
    fontSize: 28,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  nextButton: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 200,
    marginBottom: 80, 
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});