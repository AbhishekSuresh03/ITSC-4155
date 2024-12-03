import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import { Icon } from 'react-native-elements';
import { fetchTrailsByUserId } from '../service/trailService';
import { AuthContext } from '../context/AuthContext';
import TrailDetailModal from './TrailDetailModal';
import { fetchUserById, followUser, unfollowUser, getFollowingIds } from '../service/userService';

const defaultProfilePic = require('../assets/default-user-profile-pic.jpg');

export default function UserProfileModal({ visible, onClose, userId }) {
  const [user, setUser] = useState(null);
  const [trails, setTrails] = useState([]);
  const [totalMiles, setTotalMiles] = useState(0);
  const [trailPictures, setTrailPictures] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [trailModalVisible, setTrailModalVisible] = useState(false);
  const { user: loggedInUser } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingIds, setFollowingIds] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchUserTrails();
      checkIfFollowing();
      fetchFollowingIds();
    }
  }, [userId]);

  const fetchFollowingIds = async () => {
    try {
      const ids = await getFollowingIds(loggedInUser.id);
      setFollowingIds(ids);
      if(ids.includes(userId)){
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (error) {
      console.error('Error fetching following IDs:', error.message);
    }
  };
  const fetchUserData = async () => {
    try {
      const userData = await fetchUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchUserTrails = async () => {
    try {
      const fetchedTrails = await fetchTrailsByUserId(userId);
      setTrails(fetchedTrails);
      const pictures = getTrailPictures(fetchedTrails);
      setTrailPictures(pictures);
      const miles = fetchedTrails.reduce((sum, trail) => sum + (trail.length || 0), 0).toFixed(2);
      setTotalMiles(miles);
    } catch (error) {
      console.error('Error fetching trails:', error);
    }
  };

  const getTrailPictures = (trails) => {
    const trailPictures = [];
    trails.forEach(trail => {
      if (trail.primaryImage) {
        trailPictures.push(trail.primaryImage);
      }
      if (trail.images && Array.isArray(trail.images)) {
        trailPictures.push(...trail.images);
      }
    });
    return trailPictures;
  };

  const openTrailModal = (trail) => {
    setSelectedTrail(trail);
    setTrailModalVisible(true);
  };

  const closeTrailModal = () => {
    setTrailModalVisible(false);
    setSelectedTrail(null);
  };

  const checkIfFollowing = () => {
    setIsFollowing(loggedInUser.following.includes(userId));
  };

  const handleFollow = async () => {
    try {
      await followUser(loggedInUser.id, userId);
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(loggedInUser.id, userId);
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error.message);
    }
  };

  if (!user) return null;

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
            <Image source={{ uri: user.profilePicture || defaultProfilePic }} style={styles.profilePicture} />
            <View style={styles.headerContainer}>
              <Text style={styles.userName}>{user.username}</Text>
              <Text style={styles.fullName}>{user.firstName} {user.lastName}</Text>
              <Text style={styles.location}>{user.city}, {user.state}</Text>
              {isFollowing ? (
                <Button title="Unfollow" onPress={handleUnfollow} />
              ) : (
                <Button title="Follow" onPress={handleFollow} />
              )}
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.followers.length}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.following.length}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{trails.length}</Text>
                <Text style={styles.statLabel}>Trails</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalMiles}</Text>
                <Text style={styles.statLabel}>Miles</Text>
              </View>
            </View>
            <View style={styles.divider} />
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ width: '100%' }}>
            <View style={styles.trailsContainer}>
              {trails.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No trails to display!</Text>
                  <Image source={require('../assets/emptyProfileNav.png')} style={styles.emptyImage} />
                </View>
              ) : (
                trails.map((trail) => (
                  <TouchableOpacity key={trail.id} style={styles.trailCard} onPress={() => openTrailModal(trail)}>
                    <Image source={{ uri: trail.primaryImage }} style={styles.trailImage} />
                    <View style={styles.trailInfo}>
                      <Text style={styles.trailName}>{trail.name}</Text>
                      <Text style={styles.trailLocation}>{trail.city}, {trail.state}</Text>
                      <Text style={styles.trailDetails}>{trail.difficulty} | {trail.length} Miles | {trail.time}</Text>
                      <Text style={styles.trailDescription}>
                        {trail.description.length > 100 ? `${trail.description.slice(0, 100)}...` : trail.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>
        </View>
      </View>
      <TrailDetailModal visible={trailModalVisible} onClose={closeTrailModal} trail={selectedTrail} />
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
    width: '90%',
    height: '90%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 20,
    alignSelf: 'center', // Center the profile picture horizontally
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 18,
    color: 'gray',
  },
  location: {
    fontSize: 16,
    color: 'gray',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    marginVertical: 0,
  },
  trailsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  trailCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  trailImage: {
    width: '100%',
    height: 200,
  },
  trailInfo: {
    padding: 16,
  },
  trailName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trailLocation: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
  },
  trailDetails: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 8,
  },
  trailDescription: {
    fontSize: 14,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});