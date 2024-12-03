import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getSavedTrails } from '../service/userService';
import { fetchTrailById } from '../service/trailService';
import TrailDetailModal from './TrailDetailModal';
import { formatDate, formatTime } from '../utils/formattingUtil';
import { Icon } from 'react-native-elements';
import UserProfileModal from './UserProfileModal';


const defaultProfilePic = require('../assets/default-user-profile-pic.jpg');

export default function SavedScreen() {
  const { user } = useContext(AuthContext);
  const [savedTrails, setSavedTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userProfileModalVisible, setUserProfileModalVisible] = useState(false); 
  const [selectedUserId, setSelectedUserId] = useState(null); // for the profile modal

  useEffect(() => {
    loadSavedTrails();
  }, []);

  const loadSavedTrails = async () => {
    try {
      const trailIds = await getSavedTrails(user.id);
      const reversedTrailIds = trailIds.reverse(); //display newest trails first
      const trails = await Promise.all(reversedTrailIds.map(id => fetchTrailById(id))); //this is janky. fix later
      setSavedTrails(trails);
    } catch (error) {
      console.error('Error fetching saved trails:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSavedTrails();
    setRefreshing(false);
  };

  const openModal = (trail) => {
    setSelectedTrail(trail);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTrail(null);
  };

  const openUserProfileModal = (userId) => {
    setSelectedUserId(userId);
    setUserProfileModalVisible(true);
  };

  const closeUserProfileModal = () => {
    setUserProfileModalVisible(false);
    setSelectedUserId(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading saved trails...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {savedTrails.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image source={require('../assets/emptyProfileNav.png')} style={styles.emptyImage} />
            <Text style={styles.emptyText}>No saved trails to display. Pull down to refresh.</Text>
          </View>
        ) : (
          savedTrails.map((trail) => (
            <TouchableOpacity key={trail.id} style={styles.trailContainer} onPress={() => openModal(trail)}>
              <View style={styles.trailHeader}>
                <TouchableOpacity onPress={() => openUserProfileModal(trail.owner.id)}>
                  <Image source={{ uri: trail.owner.profilePicture || defaultProfilePic }} style={styles.profilePicture} />
                </TouchableOpacity>
                <View style={styles.trailHeaderText}>
                  <Text style={styles.userName}>{trail.owner.username}</Text>
                  <Text style={styles.date}>{formatDate(trail.date)}</Text>
                </View>
              </View>
              <Image source={{ uri: trail.primaryImage }} style={styles.trailImage} />
              <Text style={styles.trailName}>{trail.name}</Text>
              <Text style={styles.trailLocation}>{trail.city}, {trail.state}</Text>
              <Text style={styles.trailDetails}>
                <Icon name="star" type="font-awesome" color="#f50" size={12} /> {trail.rating} | {trail.difficulty} | {trail.length.toFixed(2)} Miles | {formatTime(trail.time)}
              </Text>
              <Text style={styles.trailDescription}>
                {trail.description.length > 100 ? `${trail.description.slice(0, 100)}...` : trail.description}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TrailDetailModal visible={modalVisible} onClose={closeModal} trail={selectedTrail} />
      <UserProfileModal
        visible={userProfileModalVisible}
        onClose={closeUserProfileModal}
        userId={selectedUserId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  trailContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10, // Updated to match the CommunityScreen
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  trailImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  trailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  trailHeaderText: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: 'grey',
  },
  trailImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  trailName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  trailLocation: {
    fontSize: 14,
    color: 'grey',
  },
  trailDetails: {
    fontSize: 14,
    color: 'grey',
    marginTop: 5,
  },
  trailDescription: {
    fontSize: 14,
    color: 'grey',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
});