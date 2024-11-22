import React, { useState, useEffect } from 'react';
import { View, Button, Alert, StyleSheet, Text, ActivityIndicator, Modal, TextInput, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import * as FileSystem from 'expo-file-system'; // Import Expo FileSystem

const StartTrailModal = () => {
  const [location, setLocation] = useState(null);
  const [trailActive, setTrailActive] = useState(false);
  const [trailStartLocation, setTrailStartLocation] = useState(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // To manage modal visibility
  const [formData, setFormData] = useState({
    time: 0,
    distance: 0,
    city: '',
    state: '',
    trailName: '',
    rating: '',
  }); // To store form data

  // Request location permissions
  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied.');
      return false;
    }
    return true;
  };

  // Fetch the user's current location
  const fetchLocation = async () => {
    try {
      const hasPermission = await getLocationPermission();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({});
      return location.coords;
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  };

  // Initialize location on page load
  useEffect(() => {
    const initializeLocation = async () => {
      const initialLocation = await fetchLocation();
      if (initialLocation) setLocation(initialLocation);
      setLoading(false);
    };
    initializeLocation();
  }, []);

  // Start tracking the trail
  const startTrail = async () => {
    const currentLocation = await fetchLocation();
    if (!currentLocation) return;

    setTrailStartLocation(currentLocation);
    setLocation(currentLocation);
    setTrailActive(true);

    // Start the timer
    const timerId = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    setIntervalId(timerId);
  };

  // End the trail and show the modal
  const endTrail = () => {
    setTrailActive(false);
    setTrailStartLocation(null);
    setElapsedTime(0);
    setDistanceTraveled(0);

    // Clear the timer
    clearInterval(intervalId);
    setIntervalId(null);

    // Show the modal
    setModalVisible(true);
    setFormData({
      ...formData,
      time: Math.floor(elapsedTime / 60) + ' min ' + (elapsedTime % 60) + ' sec',
      distance: distanceTraveled.toFixed(2) + ' miles',
    });
  };

  // Calculate distance between two locations (Haversine formula, converted to miles)
  const calculateDistance = (loc1, loc2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 3958.8; // Earth's radius in miles

    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(loc1.latitude)) *
        Math.cos(toRad(loc2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  };

  // Track the user's location while the trail is active
  useEffect(() => {
    let locationSubscription;
    if (trailActive) {
      const watchLocation = async () => {
        locationSubscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 5 }, // Update every 5 meters
          (newLocation) => {
            if (location) {
              const distance = calculateDistance(location, newLocation.coords);
              setDistanceTraveled((prevDistance) => prevDistance + distance);
            }
            setLocation(newLocation.coords);
          }
        );
      };
      watchLocation();
    }

    return () => {
      if (locationSubscription) locationSubscription.remove();
    };
  }, [trailActive, location]);

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle form submission and save form data to a JSON file using Expo's FileSystem
  const handleSubmit = async () => {
    const filePath = FileSystem.documentDirectory + 'trail_data.json'; // Path to save the JSON file

    const dataToSave = JSON.stringify(formData, null, 2); // Convert form data to JSON

    try {
      // Write JSON data to file
      await FileSystem.writeAsStringAsync(filePath, dataToSave);
      Alert.alert('Success', 'Trail data saved successfully!');

      // Check if the file exists using getInfoAsync
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (fileInfo.exists) {
        console.log('File exists at path:', filePath);
        console.log('File size (bytes):', fileInfo.size);  // Log the file size for extra info

        // Optionally, read the content of the file to verify the saved data
        const fileContent = await FileSystem.readAsStringAsync(filePath);
        console.log('File content:', fileContent); // Log the content to check if data was written
      } else {
        console.log('File does not exist.');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      Alert.alert('Error', 'Failed to save the trail data.');
    }

    setModalVisible(false); 
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              {trailStartLocation && (
                <Marker coordinate={trailStartLocation} title="Start Point" />
              )}
              <Marker coordinate={location} title="Your Location" />
            </MapView>
          )}
          <View style={styles.infoContainer}>
            {trailActive && (
              <>
                <Text style={styles.infoText}>
                  Distance Traveled: {distanceTraveled.toFixed(2)} miles
                </Text>
                <Text style={styles.infoText}>
                  Elapsed Time: {Math.floor(elapsedTime / 60)} min {elapsedTime % 60} sec
                </Text>
              </>
            )}
            {trailActive ? (
              <Button title="End Trail" onPress={endTrail} />
            ) : (
              <Button title="Start Trail" onPress={startTrail} />
            )}
          </View>
        </>
      )}

      {/* Modal for submitting trail info */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Trail Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the city where you hiked"
              value={formData.city}
              onChangeText={(text) => handleInputChange('city', text)}
              placeholderTextColor="#A9A9A9"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter the state where you hiked"
              value={formData.state}
              onChangeText={(text) => handleInputChange('state', text)}
              placeholderTextColor="#A9A9A9"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter the trail name"
              value={formData.trailName}
              onChangeText={(text) => handleInputChange('trailName', text)}
              placeholderTextColor="#A9A9A9"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your rating (1-5)"
              value={formData.rating}
              onChangeText={(text) => handleInputChange('rating', text)}
              placeholderTextColor="#A9A9A9"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%', // Change this to 100%
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default StartTrailModal;
