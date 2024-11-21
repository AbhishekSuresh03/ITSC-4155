import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import { getAllUsers } from '../service/userService';
import { sanitizeSearchQuery } from '../utils/sanitize';
const defaultImage = require('../assets/icon.png');
const defaultProfilePic = require('../assets/default-user-profile-pic.jpg');

export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [trails] = useState([
    {
      id: 1,
      name: 'River Loop',
      city: 'Charlotte',
      state: 'North Carolina',
      rating: 4.5,
      difficulty: 'Moderate',
      length: '5 miles',
      time: '2 hours',
      image: defaultImage,
    },
    {
      id: 2,
      name: 'Trail Name 2',
      city: 'City 2',
      state: 'State 2',
      rating: 4.0,
      difficulty: 'Easy',
      length: '3 miles',
      time: '1.5 hours',
      image: null,
    },
  ]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredTrails, setFilteredTrails] = useState([]);

  // Fetch all users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (text) => {
    const sanitizedText = sanitizeSearchQuery(text);
    setSearch(sanitizedText);

    // Filter users
    const filteredUserList = users.filter((user) =>
      user.username.toLowerCase().includes(sanitizedText.toLowerCase())
    );
    setFilteredUsers(filteredUserList);

    // Filter trails
    const filteredTrailList = trails.filter((trail) =>
      trail.name.toLowerCase().includes(sanitizedText.toLowerCase())
    );
    setFilteredTrails(filteredTrailList);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by username or trail"
        value={search}
        onChangeText={handleSearch}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionHeader}>Users</Text>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userContainer}>
            <Image source={{ uri: user.profilePicture || defaultProfilePic }} style={styles.profilePicture} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.fullName}>{user.firstName} {user.lastName}</Text>
              <Text style={styles.location}>{user.city}, {user.state}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.sectionHeader}>Trails</Text>
        {filteredTrails.map((trail) => (
          <View key={trail.id} style={styles.trailContainer}>
            <Image source={trail.image || defaultImage} style={styles.trailImage} />
            <Text style={styles.trailName}>{trail.name}</Text>
            <Text style={styles.trailLocation}>
              {trail.city}, {trail.state}
            </Text>
            <Text style={styles.trailDetails}>
              {trail.rating} stars | {trail.difficulty} | {trail.length} | {trail.time}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 14,
    color: 'gray',
  },
  location: {
    fontSize: 12,
    color: 'gray',
  },
  trailContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    elevation: 2,
  },
  trailImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  trailName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trailLocation: {
    fontSize: 14,
    color: 'gray',
  },
  trailDetails: {
    fontSize: 12,
    color: 'gray',
  },
});
