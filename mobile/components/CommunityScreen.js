import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import TrailDetailModal from './TrailDetailModal';
import { fetchTrails } from '../service/trailService';
import { AuthContext } from '../context/AuthContext';

// Default Images
const defaultImage = require('../assets/icon.png');
const defaultProfilePic = require('../assets/default-user-profile-pic.jpg');

export default function CommunityScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [activeTab, setActiveTab] = useState('Local');
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Access user from AuthContext

  useEffect(() => {
    const loadTrails = async () => {
      try {
        const fetchedTrails = await fetchTrails();
        setTrails(fetchedTrails);
      } catch (error) {
        console.error('Error fetching trails:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTrails();
  }, []);

  const openModal = (trail) => {
    setSelectedTrail(trail);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTrail(null);
  };

  const filteredTrails = trails.filter((trail) => {
    if (activeTab === 'Local') {
      return user && (trail.city === user.city || trail.state === user.state);
    } else if (activeTab === 'Following') {
      return user && user.friends.includes(trail.userName);
    }
    return true;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading trails...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => setActiveTab('Local')}>
          <Text style={[styles.navButtonText, activeTab === 'Local' && styles.activeNavButtonText]}>Local</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => setActiveTab('Following')}>
          <Text style={[styles.navButtonText, activeTab === 'Following' && styles.activeNavButtonText]}>Following</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        {filteredTrails.map((trail) => (
          <TouchableOpacity key={trail.id} style={styles.trailContainer} onPress={() => openModal(trail)}>
            <View style={styles.trailHeader}>
              <TouchableOpacity onPress={() => navigation.navigate('Profile', { user: users.find(user => user.userName === trail.userName) })}>
                <Image source={trail.profilePic} style={styles.profilePicture} />
              </TouchableOpacity>
              <View style={styles.trailHeaderText}>
                <Text style={styles.userName}>{trail.userName}</Text>
                <Text style={styles.date}>{trail.date}</Text>
              </View>
            </View>
            <Image source={{ uri: trail.primaryImage }} style={styles.trailImage} />
            <Text style={styles.trailName}>{trail.name}</Text>
            <Text style={styles.trailLocation}>{trail.city}, {trail.state}</Text>
            <Text style={styles.trailDetails}>
              <Icon name="star" type="font-awesome" color="#f50" size={12} /> {trail.rating} | {trail.difficulty} | {trail.length} | {trail.time}
            </Text>
            <Text style={styles.trailDescription}>
              {trail.description.length > 100 ? `${trail.description.slice(0, 100)}...` : trail.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TrailDetailModal visible={modalVisible} onClose={closeModal} trail={selectedTrail} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: -10,
    marginVertical: 5,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
  },
  activeNavButtonText: {
    color: '#000000',
    borderBottomWidth: 2,
    borderBottomColor: '#FFC107',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  scrollView: {
    margin: -12,
  },
  trailContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
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
});