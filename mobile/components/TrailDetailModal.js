import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { formatDate, formatTime, formatPace } from '../utils/formattingUtil';

const defaultImage = require('../assets/icon.png');
const defaultProfilePic = require('../assets/default-user-profile-pic.jpg');

export default function TrailDetailModal({ visible, onClose, trail }) {
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
          <Image source={{uri: trail.primaryImage}} style={styles.trailImage} />
            <View style={styles.headerContainer}>
              <Image source={{uri: trail.owner.profilePicture}} style={styles.profilePicture} />
              <Text style={styles.userName}>{trail.owner.username}</Text>
            </View>
            <Text style={styles.trailName}>{trail.name}</Text>
            <View style={styles.trailInfo}>
              <View style={styles.ratingContainer}>
                <Icon name="star" type="font-awesome" color="#f50" size={28} />
                <Text style={styles.trailRating}>{trail.rating}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoGrid}>
                <Text style={styles.infoItem}>Length: <Text style={styles.boldText}>{trail.length.toFixed(2)}</Text></Text>
                <Text style={styles.infoItem}>Time: <Text style={styles.boldText}>{formatTime(trail.time)}</Text></Text>
                <Text style={styles.infoItem}>Pace: <Text style={styles.boldText}>{formatPace(trail.pace)}</Text></Text>
                <Text style={styles.infoItem}>Difficulty: <Text style={styles.boldText}>{trail.difficulty}</Text></Text>
              </View>
              <Text style={styles.trailDescription}>{trail.description}</Text>
              <View style={styles.separator} />
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
  scrollViewContent: {
    padding: -10,
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
    height: 320,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',

  },
  trailName: {
    fontSize: 38, // Make the trail name even bigger
    fontWeight: 'bold',
    marginTop: -10, // Adjust margin to make it closer to the header
    textAlign: 'left', // Align text to the left
    width: '100%', // Ensure it spans the full width
    paddingHorizontal: 20, // Add padding to match the header
  },
  trailInfo: {
    padding: 20,
    width: '100%', // Ensure it spans the full width
  },
  ratingContainer: {
    flexDirection: 'row', // Align star and rating number in a row
    alignItems: 'center', // Center items vertically
    marginBottom: 10,
  },
  trailRating: {
    marginTop: 6,
    fontSize: 20, // Increased font size for the rating number
    color: 'grey',
    marginLeft: 2, // Reduce space between the star and the rating number
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
    marginTop: 25,
    marginBottom: 10,
    textAlign: 'left', // Align text to the left
    paddingHorizontal: 0, // Add padding to match the header
  },
  infoItem: {
    marginBottom: 10,
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
});