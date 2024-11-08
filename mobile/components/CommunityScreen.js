import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import TrailDetailModal from './TrailDetailModal';

// Default images for trail and profile picture
const defaultImage = require('../assets/icon.png');
const defaultProfilePic = require('../assets/default-user-profile-pic.jpg');

export default function CommunityScreen() {
  // State to manage the search input
  const [search, setSearch] = React.useState('');
  // State to manage the visibility of the modal
  const [modalVisible, setModalVisible] = useState(false);
  // State to manage the selected trail for the modal
  const [selectedTrail, setSelectedTrail] = useState(null);

  // Sample trail data
  const trails = [
    {
      id: 1,
      name: 'River Loop',
      city: 'Charlotte',
      state: 'North Carolina',
      rating: 4.5,
      difficulty: 'Moderate',
      length: '5 miles',
      time: '2 hours',
      pace: '4:49',
      image: require('../assets/trail1.jpg'),
      profilePic: defaultProfilePic,
      userName: 'John Doe',
      date: '2023-10-01',
      description: 'A beautiful trail along the river with moderate difficulty.',
    },
    {
      id: 2,
      name: 'Trail Name 2 - - - - - - - - - --------',
      city: 'City 2',
      state: 'State 2',
      rating: 4.0,
      difficulty: 'Easy',
      length: '3 miles',
      time: '1.5 hours',
      pace: '8899:489',
      // No image provided for this trail
      profilePic: defaultProfilePic,
      userName: 'Jane Smith',
      date: '2023-10-02',
      description: 'An easy trail perfect for beginners. I initially Thought it was going to be difficult but after i did it i realized it was so easy!',
    },
    // Add more trail objects here
  ];

  // Function to open the modal and set the selected trail
  const openModal = (trail) => {
    setSelectedTrail(trail);
    setModalVisible(true);
  };

  // Function to close the modal and reset the selected trail
  const closeModal = () => {
    setModalVisible(false);
    setSelectedTrail(null);
  };

  return (
    <View style={styles.container}>
      {/* Navbar with two options: Local and Following */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Local</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Following</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar to filter trails */}
      <SearchBar
        placeholder="Find trails"
        onChangeText={setSearch}
        value={search}
        lightTheme
        round
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
      />

      {/* Scrollable list of trail cards */}
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        {trails.map((trail) => (
          // Each trail card is a touchable component that opens the modal with detailed trail info
          <TouchableOpacity key={trail.id} style={styles.trailContainer} onPress={() => openModal(trail)}>
            <View style={styles.trailHeader}>
              <Image source={trail.profilePic} style={styles.profilePicture} />
              <View style={styles.trailHeaderText}>
                <Text style={styles.userName}>{trail.userName}</Text>
                <Text style={styles.date}>{trail.date}</Text>
              </View>
            </View>
            <Image source={trail.image ? trail.image : defaultImage} style={styles.trailImage} />
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

      {/* Modal to show detailed trail information */}
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
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginVertical: 10,
  },
  searchBarInput: {
    backgroundColor: '#e1e1e1',
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
});