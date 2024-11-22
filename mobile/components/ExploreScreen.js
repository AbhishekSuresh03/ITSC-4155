import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { getAllUsers, followUser } from '../service/userService';
import { AuthContext } from '../context/AuthContext';
const defaultProfilePic = require('../assets/default-user-profile-pic.jpg');


export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const { user } = useContext(AuthContext); 
  const [followStatus, setFollowStatus] = useState({}); 



  //get all users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        setUsers({});
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleFollow = async (userIdToFollow) => {
    try {
      const isFollowing = user.homies.includes(userIdToFollow);
      if (isFollowing) {
        // Unfollow the user
        const response = await unfollowUser(user.id, userIdToFollow);
        if (response.success) {
          // Fetch updated user data from the backend
          const updatedUser = await getUser(user.id);
          setUser(updatedUser);
        } else {
          console.error('Failed to unfollow user:', response.message);
        }
      } else {
        // Follow the user
        const response = await followUser(user.id, userIdToFollow);
        if (response.success) {
          // Fetch updated user data from the backend
          const updatedUser = await getUser(user.id);
          setUser(updatedUser);
        } else {
          console.error('Failed to follow user:', response.message);
        }
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by username"
        value={search}
        onChangeText={handleSearch}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {filteredUsers.map(user => (
          <View key={user.id} style={styles.userContainer}>
            <Image source={{ uri: user.profilePicture || defaultProfilePic }} style={styles.profilePicture} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.fullName}>{user.firstName} {user.lastName}</Text>
              <Text style={styles.location}>{user.city}, {user.state}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.followButton,
                user.homies.includes(userToFollow.id) && styles.followingButton
              ]}
              onPress={() => handleFollow(userToFollow.id)}
            >
              <Text style={[
                styles.followButtonText,
                user.homies.includes(userToFollow.id) && styles.followingButtonText
              ]}>
                {user.homies.includes(userToFollow.id) ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
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
  followButton: {
    backgroundColor: '#0095F6',
    padding: 10,
    borderRadius: 10
  },
  followButtonText:{
    color: 'white',
    fontWeight: 'bold',
  },
  followingButton: {
    backgroundColor: '#fff',
    borderColor: '#0095F6',
    borderWidth: 1,
  },
  followingButtonText: {
    color: '#0095F6',
  },
});