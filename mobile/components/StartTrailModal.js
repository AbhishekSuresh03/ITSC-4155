import React, { useState, useEffect } from 'react';
import { View, Button, Alert, StyleSheet, Text, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const StartTrailModal = () => {
  const [location, setLocation] = useState(null); // User's current location
  const [trailActive, setTrailActive] = useState(false); // Whether the trail is active
  const [trailStartLocation, setTrailStartLocation] = useState(null); // Starting point of the trail
  const [distanceTraveled, setDistanceTraveled] = useState(0); // Distance covered in miles
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in seconds
  const [intervalId, setIntervalId] = useState(null); // Timer interval ID
  const [loading, setLoading] = useState(true); // Loading state for location

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

  // End the trail
  const endTrail = () => {
    setTrailActive(false);
    setTrailStartLocation(null);
    setElapsedTime(0);
    setDistanceTraveled(0);

    // Clear the timer
    clearInterval(intervalId);
    setIntervalId(null);
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  infoContainer: {
    padding: 20,
    width: '100%',
    backgroundColor: 'white',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default StartTrailModal;
