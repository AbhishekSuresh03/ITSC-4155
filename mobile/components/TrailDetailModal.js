import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';

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
              </View>
              <View style={styles.separator} />
              <View style={styles.infoGrid}>
                <Text style={styles.infoItem}>Length: <Text style={styles.boldText}>{trail.length}</Text></Text>
                <Text style={styles.infoItem}>Time: <Text style={styles.boldText}>{trail.time}</Text></Text>
                <Text style={styles.infoItem}>Pace: <Text style={styles.boldText}>{trail.pace}</Text></Text>
                <Text style={styles.infoItem}>Difficulty: <Text style={styles.boldText}>{trail.difficulty}</Text></Text>
              </View>
              <Text style={styles.trailDescription}>{trail.description}</Text>
              <View style={styles.separator} />
              <View style={styles.imagesContainer}>
                {trail.images && trail.images.map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.additionalImage} />
                ))}
              </View>
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
    zIndex: 1,
  },
  trailImage: {
    width: '100%',
    height: 320,
    marginBottom: 15,
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
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  trailName: {
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: -10,
    textAlign: 'left',
    width: '100%',
    marginLeft: 10,
  },
  trailInfo: {
    padding: 20,
    width: '100%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trailRating: {
    marginTop: 6,
    fontSize: 20,
    color: 'grey',
    marginLeft: 2,
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
  infoItem: {
    marginBottom: 10,
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  trailDescription: {
    fontSize: 14,
    color: 'grey',
    marginTop: 25,
    marginBottom: 10,
    textAlign: 'left',
    paddingHorizontal: 5,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  additionalImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
});