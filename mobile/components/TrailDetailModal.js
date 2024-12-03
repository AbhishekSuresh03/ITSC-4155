import React, { useRef, useEffect, useContext, useState } from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Button } from 'react-native';
import { Icon } from 'react-native-elements';
import { formatDate, formatTime, formatPace } from '../utils/formattingUtil';
import MapView, { Polyline } from 'react-native-maps';
import { smoothCoordinates } from '../utils/locationUtil';
import { AuthContext } from '../context/AuthContext';
import { saveTrail, unsaveTrail, getSavedTrails } from '../service/userService';

const defaultImage = require('../assets/icon.png');
const defaultProfilePic = require('../assets/default-user-profile-pic.jpg');

export default function TrailDetailModal({ visible, onClose, trail }) {
  
  const mapRef = useRef(null);
  const { user } = useContext(AuthContext);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user && trail) {
      checkIfSaved();
    }
  }, [user, trail]);

  const checkIfSaved = async () => {
    try {
      const savedTrails = await getSavedTrails(user.id);
      setIsSaved(savedTrails.includes(trail.id));
    } catch (error) {
      console.error('Error checking if trail is saved:', error.message);
    }
  };

  const handleSave = async () => {
    try {
      await saveTrail(user.id, trail.id);
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving trail:', error.message);
    }
  };

  const handleUnsave = async () => {
    try {
      await unsaveTrail(user.id, trail.id);
      setIsSaved(false);
    } catch (error) {
      console.error('Error unsaving trail:', error.message);
    }
  };
  if (!trail) return null;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ width: '100%' }}>
            <Image source={{ uri: trail.primaryImage }} style={styles.trailImage} />
            <View style={styles.headerContainer}>
              <Image source={{ uri: trail.owner.profilePicture }} style={styles.profilePicture} />
              <Text style={styles.userName}>{trail.owner.username}</Text>
            </View>
            <Text style={styles.trailName}>{trail.name}</Text>
            <View style={styles.trailInfo}>
              <View style={styles.ratingContainer}>
                <Icon name="star" type="font-awesome" color="#f50" size={28} />
                <Text style={styles.trailRating}>{trail.rating}</Text>
                <TouchableOpacity onPress={isSaved ? handleUnsave : handleSave}>
                  <Icon
                    name={isSaved ? "bookmark" : "bookmark-o"}
                    type="font-awesome"
                    color={isSaved ? "#f50" : "gray"}
                    size={28}
                    style={styles.bookmarkIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoGrid}>
                <Text style={styles.infoItem}>Length: <Text style={styles.boldText}>{trail.length.toFixed(2)} Miles</Text></Text>
                <Text style={styles.infoItem}>Time: <Text style={styles.boldText}>{formatTime(trail.time)}</Text></Text>
                <Text style={styles.infoItem}>Pace: <Text style={styles.boldText}>{formatPace(trail.pace)}</Text></Text>
                <Text style={styles.infoItem}>Difficulty: <Text style={styles.boldText}>{trail.difficulty}</Text></Text>
              </View>
              <Text style={styles.trailDescription}>{trail.description}</Text>
              <View style={styles.separator} />
              <MapView
                ref={mapRef}
                style={styles.map}
                mapType="satellite"
                onLayout={() => {
                  if (trail.route && trail.route.length > 0) {
                    mapRef.current.fitToCoordinates(trail.route, {
                      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                      animated: true,
                    });
                  }
                }}
              >
                <Polyline
                  coordinates={smoothCoordinates(trail.route)}
                  strokeWidth={3}
                  strokeColor="#007AFF"
                />
              </MapView>
              <ScrollView horizontal style={styles.extraImagesContainer}>
                {trail.images.map((image, index) => (
                  <View key={index} style={styles.extraImageWrapper}>
                    <Image source={{ uri: image }} style={styles.extraImage} />
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}



const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 1,
  },
  trailImage: {
    width: '100%',
    height: 230, // Adjusted to be slightly more rectangular
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10, // Added padding for better spacing
    paddingHorizontal: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10, // Added margin for spacing
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  trailName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -5,
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 20,
  },
  trailInfo: {
    paddingHorizontal: 20,
    width: '100%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:5,
    marginBottom: 10,
  },
  trailRating: {
    marginLeft: 5,
    fontSize: 20,
    color: 'grey',
  },
  separator: {
    height: 1,
    backgroundColor: 'grey',
    marginVertical: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  trailDescription: {
    fontSize: 14,
    color: 'grey',
    marginTop: 0,
    marginBottom: 10,
    textAlign: 'left',
    paddingHorizontal: 0,
  },
  infoItem: {
    marginBottom: 10,
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  extraImagesContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  extraImageWrapper: {
    marginRight: 10,
  },
  extraImage: {
    width: 100,
    height: 100, // Adjusted to be more rectangular
    borderRadius: 10,
  },
  bookmarkIcon: {
    marginLeft: 10,
  },
});