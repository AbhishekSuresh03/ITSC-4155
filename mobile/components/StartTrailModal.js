import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import { Slider } from 'react-native-paper';

const TrailApp = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [tracking, setTracking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [distance, setDistance] = useState(0);
    const [trailName, setTrailName] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [rating, setRating] = useState(5); // Default rating is 5
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        (async () => {
            //might need this, might not...
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation(location.coords);
            setCity('Sample City'); // Replace with dynamic city based on location if needed
            setState('Sample State'); // Replace with dynamic state based on location if needed
        })();
    }, []);

    // Haversine formula to calculate distance between two lat/lng points (in miles)
    const calculateDistance = (startCoords, endCoords) => {
        const toRadians = (degree) => degree * (Math.PI / 180);
        const R = 3958.8; // Radius of the Earth in miles

        const dLat = toRadians(endCoords.latitude - startCoords.latitude);
        const dLon = toRadians(endCoords.longitude - startCoords.longitude);
        const lat1 = toRadians(startCoords.latitude);
        const lat2 = toRadians(endCoords.latitude);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in miles
    };

    const startTrail = () => {
        setTracking(true);
        setStartTime(new Date());
    };

    const endTrail = () => {
        setTracking(false);
        setEndTime(new Date());
        const timeTaken = (new Date() - startTime) / 1000 / 60; // Time in minutes
        if (userLocation) {
            const trailDistance = calculateDistance(userLocation, userLocation); // Replace with real path coordinates
            setDistance(trailDistance);
        }
        setIsModalVisible(true);
    };

    const submitTrail = () => {
        // Handle form submission logic
        console.log({
            trailName,
            city,
            state,
            timeTaken: (endTime - startTime) / 1000 / 60, // Time in minutes
            distance,
            rating,
        });

        // Close modal after submission
        setIsModalVisible(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: userLocation ? userLocation.latitude : 37.78825,
                    longitude: userLocation ? userLocation.longitude : -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {userLocation && (
                    <Marker coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }} />
                )}
            </MapView>

            <View style={{ position: 'absolute', bottom: 50, left: 20, right: 20 }}>
                <Button
                    title={tracking ? 'End Trail' : 'Start Trail'}
                    onPress={tracking ? endTrail : startTrail}
                />
            </View>

            {/* Modal for submitting the trail */}
            <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                    <TextInput
                        placeholder="Trail Name"
                        value={trailName}
                        onChangeText={setTrailName}
                        style={{ borderBottomWidth: 1, marginBottom: 10 }}
                    />
                    <TextInput
                        placeholder="City"
                        value={city}
                        editable={false} // City is auto-populated
                        style={{ borderBottomWidth: 1, marginBottom: 10 }}
                    />
                    <TextInput
                        placeholder="State"
                        value={state}
                        editable={false} // State is auto-populated
                        style={{ borderBottomWidth: 1, marginBottom: 10 }}
                    />
                    <TextInput
                        placeholder="Time Taken (Minutes)"
                        value={((endTime - startTime) / 1000 / 60).toFixed(2)}
                        editable={false} // Time is auto-populated
                        style={{ borderBottomWidth: 1, marginBottom: 10 }}
                    />
                    <TextInput
                        placeholder="Distance (Miles)"
                        value={distance.toFixed(2)}
                        editable={false} // Distance is auto-populated
                        style={{ borderBottomWidth: 1, marginBottom: 10 }}
                    />
                    <Text>Rating: {rating}</Text>
                    <Slider
                        value={rating}
                        onValueChange={setRating}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        style={{ marginBottom: 20 }}
                    />
                    <TouchableOpacity onPress={submitTrail}>
                        <Text style={{ textAlign: 'center', color: 'blue' }}>Submit Trail</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
  );
}
export default TrailApp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 50, // Add padding to the top
  },
  innerContainer: {
    paddingTop: 50, // Add padding to the top
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 10,
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
    marginTop: 20,
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
  },
});