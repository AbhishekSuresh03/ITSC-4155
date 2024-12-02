import React, { useState, useEffect, useContext, useRef} from 'react';
import { View, Button, Alert, StyleSheet, Text, ActivityIndicator, Modal, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline, AnimatedRegion, Animated } from 'react-native-maps';
import * as FileSystem from 'expo-file-system'; // Import Expo FileSystem
import * as ImagePicker from 'expo-image-picker';
import { uploadTrailPic } from '../service/fileService';
import { createTrail } from '../service/trailService'; // Import createTrail function
import { AuthContext } from '../context/AuthContext';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { smoothCoordinates, calculateDistance } from '../utils/locationUtil';
import CustomMarker from '../components/CustomMarker'; // Import CustomMarker

const StartTrailModal = () => {
  const mapRef = useRef(null); // Create a ref for MapView
  const { user } = useContext(AuthContext); // Access user from AuthContext
  const [location, setLocation] = useState(null);
  const [trailActive, setTrailActive] = useState(false);
  const trailActiveRef = useRef(trailActive); // Use ref to keep track of trailActive state
  const [trailStartLocation, setTrailStartLocation] = useState(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // To manage modal visibility
  const [images, setImages] = useState([]);
  const[primaryImage, setPrimaryImage] = useState('');
  const[startCity, setStartCity] = useState('');
  const[startState, setStartState] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [markerLocation, setMarkerLocation] = useState(null);
  const [initializedLocation, setInitializedLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    rating: 0, //TODO Fix this being a string input, needs to be double or will return errors
    difficulty: '', //TODO Populate this
    length: 0,
    time: 0,
    images: [], //TODO Populate this
    //primaryImage //TODO populate this
    description: '', //TODO populate this
  }); // To store form data

  // Initialize location on page load
  useEffect(() => {
    const initializeLocation = async () => {
      console.log("initializing location")
      const initialLocation = await fetchLocation();
      if (initialLocation) 
        setLocation(initialLocation); //true location
        setMarkerLocation(
          new AnimatedRegion({
            latitude: initialLocation.latitude,
            longitude: initialLocation.longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          })
        ); //where the marker is on the map, sometimes these are different for visual purposes
        setInitializedLocation(initialLocation);
      console.log('initialized location at location: ' + initialLocation.latitude + ', ' + initialLocation.longitude);
      setLoading(false);
    };
    initializeLocation();
  }, []);

  // Track the user's location
  useEffect(() => {
    let locationSubscription;
    
    console.log("attempting to start watching location")
    const watchLocation = async () => {
      if(markerLocation == null){
        console.log("failed to start watching location, marker has not finished initaliziing")
        return null;
      }

      console.log("watching location")
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation, // Best possible accuracy for outdoor use
          distanceInterval: 2, // Update every 1 meter
          // timeInterval: 10000, // Update every 1 second
        },
        (newLocation) => {
          //getting new coordinates
          const newCoords = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          //where the marker is currently
          const markerCoordinates = { //this naming is terrible, i just need to convert the markerLocation from an AnimatedRegion to a normal
            latitude: markerLocation.latitude.__getValue(),
            longitude: markerLocation.longitude.__getValue(),
          }
          
          if(trailActiveRef.current){ //if trail is active, it will start tracking the location | has to use a ref rather than the trailActive variable, but they have a direct relationship
            console.log("moving marker: trail is active, appending coordinates to route")
            //calculatating the distance between the current location (where the marker is) and the new location") 
            const markerDistance = calculateDistance(markerCoordinates, newLocation.coords);
            setDistanceTraveled((prevDistance) => prevDistance + markerDistance); //adding it to the total distance
           
            setRouteCoordinates((prevCoords) => [...prevCoords, newCoords]);
          } else {
            console.log('moving marker, but trail is not active')
          }
          markerLocation.timing(newCoords).start(); // Smoothly animate marker to new location
          setLocation(newLocation.coords); // i dont even know why I need the true location anymore but if i remove this things break 
        }
      );
    };
    watchLocation();
    return () => {
      console.log("stopping watching location")
      if (locationSubscription) locationSubscription.remove();
    };
  }, [initializedLocation]);

  //update the trailactive ref to be 1 to 1 with trailActive so that the watchlocation does need the trailActive as a dependency
  //just trust me
  useEffect(() => {
    trailActiveRef.current = trailActive;
  }, [trailActive]);

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
  
  async function getCityAndState(latitude, longitude) {
    try {
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      return {
        city: address.city,
        state: address.region,
      };
    } catch (error) {
      console.error('Error getting city and state:', error);
      return {
        city: '',
        state: '',
      };
    }
  }

  // Start tracking the trail
  const startTrail = async () => {
    const currentLocation = location
    if (!currentLocation) return;

    setTrailStartLocation(currentLocation); //this might be redundant, but not deleting for now
    setRouteCoordinates([currentLocation]); // Clear the route for a new one, initialize the current location as the start point (which is the first value)

    //added by hunter to automatically populate city and state based on start location
    let cityAndState = await getCityAndState(currentLocation.latitude, currentLocation.longitude); //this is terrible code I know, i just want to finish this
    setStartCity(cityAndState.city);
    setStartState(cityAndState.state);
    
    setTrailActive(true);

    // Start the timer
    const timerId = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    setIntervalId(timerId);
  };

  // End the trail and show the modal
  const endTrail = () => {
    console.log('ending trail')
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
      time: elapsedTime, // changning from this to store raw data in db: Math.floor(elapsedTime / 60) + ' min ' + (elapsedTime % 60) + ' sec',
      length: distanceTraveled, //chaning from this to store raw data in DB: distanceTraveled.toFixed(2) + ' miles',
      city: startCity,
      state: startState,
      route: routeCoordinates,
    });
  };

  /**
   * Handles the submission of the trail form data.
   * 
   * This function collects the form data, including trail details such as name, city, state, rating, difficulty, length, time, images, primary image, description, and route coordinates.
   * It then sends this data to the backend to create a new trail.
   * 
   * Expected form data input:
   * - name: The name of the trail (string).
   * - city: The city where the trail is located (string).
   * - state: The state where the trail is located (string).
   * - rating: The rating of the trail (number).
   * - difficulty: The difficulty level of the trail (string).
   * - length: The length of the trail in miles (number).
   * - time: The time taken to complete the trail in seconds (number).
   * - images: An array of image URLs associated with the trail (array of strings).
   * - primaryImage: The primary image URL for the trail (string).
   * - description: A description of the trail (string).
   * - route: An array of coordinates representing the trail route (array of objects with latitude and longitude properties).
   * 
   * @async
   * @function handleSubmit
   * @returns {Promise<void>} A promise that resolves when the form data has been successfully submitted.
   */
  const handleSubmit = async () => {
    const dataToSave = JSON.stringify(formData, null, 2); // Convert form data to JSON
    console.log(dataToSave);
    try {
      const trailData = await createTrail(formData, user.id);  
    } catch (error) {
      console.error('Create trail error:', error.message);
      Alert.alert('Trail could not be created', error.message);
    }

    setModalVisible(false); 
  };

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  //IMAGE STUFF
  const pickImages = async () => {
    console.log('Pick image button pressed');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [1, 1], // Set aspect ratio to 1:1 for a square crop
      quality: 1,
    });

    console.log('Image picker result:', result);

    if (!result.canceled) {
      const uploadedImages = images.slice(); //clearing the array
      //uploading each image individually
      // const downloadURL = await uploadTrailPic(result.assets[0].uri);
      for (let image of result.assets || []) {
        // console.log("START TRAIL: " + image.uri);
        const downloadURL = await uploadTrailPic(image.uri);
        console.log('StartTrailModal' + downloadURL);
        uploadedImages.push(downloadURL); //adding the url to the array
      }
      setImages(uploadedImages); //updating the state with the array of urls
      setFormData({ ...formData, images: uploadedImages });
    } else {
      console.log('Image picking canceled');
    }
  };

  const pickPrimaryImage = async () => {
    console.log('Pick image button pressed');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [1, 1], // Set aspect ratio to 1:1 for a square crop
      quality: 1,
    });
    if (!result.canceled) {
      const downloadURL = await uploadTrailPic(result.assets[0].uri);
      setPrimaryImage(downloadURL); 
      setFormData({ ...formData, primaryImage: downloadURL });
      
    } else {
      console.log('Image picking canceled');
    }
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
                latitudeDelta: 0.007,
                longitudeDelta: 0.007,
              }}
            >
              
          <Marker.Animated
            coordinate={markerLocation}
            title="Your Location"
          >
              <CustomMarker />
          </Marker.Animated>
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={3}
                strokeColor="#007AFF"
              />
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
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholderTextColor="#A9A9A9"
            />
            <Text style={styles.label}>Rating: {formData.rating.toFixed(1)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={5}
              step={0.1}
              value={formData.rating}
              onValueChange={(value) => handleInputChange('rating', Math.round(value * 10) / 10)}
              minimumTrackTintColor="#1EB1FC"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#1EB1FC"
            />
            <Picker
              selectedValue={formData.difficulty}
              style={styles.picker}
              onValueChange={(itemValue) => handleInputChange('difficulty', itemValue)}
            >
              <Picker.Item label="Select Difficulty" value="" />
              <Picker.Item label="Very Easy" value="Very Easy" />
              <Picker.Item label="Easy" value="Easy" />
              <Picker.Item label="Moderate" value="Moderate" />
              <Picker.Item label="Hard" value="Hard" />
              <Picker.Item label="Very Hard" value="Very Hard" />
              <Picker.Item label="Extreme" value="Extreme" />
            </Picker>

            <Button title="Upload Primary Image" onPress={pickPrimaryImage} />
            <Button title="Upload Images" onPress={pickImages} />
            <Text style={styles.uploadedImagesTitle}>Uploaded Primary Image:</Text>
            <Image source={{ uri: primaryImage }} style={styles.uploadedImage} />
            <Text style={styles.uploadedImagesTitle}>Uploaded Images:</Text>
            {images.length > 0 && (
              <View style={styles.uploadedImagesContainer}>
                <ScrollView horizontal>
                {images.map((image, index) => {
                  return <Image key={index} source={{ uri: image }} style={styles.uploadedImage} />;
                })}
                </ScrollView>
              </View>
            )}
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
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
  },
  uploadedImagesContainer: {
    //nothing for now
  },
  uploadedImagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom:20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default StartTrailModal;



