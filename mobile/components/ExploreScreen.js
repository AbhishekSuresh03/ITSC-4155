import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Button, RefreshControl } from 'react-native';
import { getAllUsers, followUser, unfollowUser, getFollowingIds } from '../service/userService';
import { AuthContext } from '../context/AuthContext';
const defaultProfilePic = require('../assets/default-user-profile-pic.jpg');


export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const { user } = useContext(AuthContext); 
  const [followingIds, setFollowingIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false); 


  //get all users from the backend
  useEffect(() => {
    fetchUsers();
    fetchFollowingIds();
  }, []);
  const fetchUsers = async () => {
    try {
      const usersData = await getAllUsers();
      const filteredUsersData = usersData.filter(u => u.id !== user.id); // Remove currently logged-in user
      setUsers(filteredUsersData);
      setFilteredUsers(filteredUsersData); 
    } catch (error) {
      setUsers({});
      console.error('Failed to fetch users:', error);
    }
  };
  const fetchFollowingIds = async () => {
    try {
      const ids = await getFollowingIds(user.id);
      setFollowingIds(ids);
    } catch (error) {
      console.error('Error fetching following IDs:', error.message);
    }
  };
  const handleSearch = (text) => {
    setSearch(text);
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleFollow = async (userIdToFollow) => {
    try{
      const response= await followUser(user.id, userIdToFollow);
      setFollowingIds([...followingIds, userIdToFollow]); //adding to followingids array to signift follow was successful
    }
    catch (error){
      console.error('Error following user:', error.message);
    }
  };

  const handleUnfollow = async (userIdToUnfollow) => {
    try{
      const response= await unfollowUser(user.id, userIdToUnfollow);
      setFollowingIds(followingIds.filter(id => id !== userIdToUnfollow)); //remove on unfollow. wont happen if unfollowUser wasnt successful since its in a trycatch
    }
    catch (error){
      console.error('Error following user:', error.message);
    }
  };

  const onRefresh = async () => { // Added this function
    setRefreshing(true);
    await fetchUsers();
    await fetchFollowingIds();
    setRefreshing(false);
  };

  console.log('People the current user is following: ' + followingIds)
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by username"
        value={search}
        onChangeText={handleSearch}
      />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredUsers.map(user => (
          <View key={user.id} style={styles.userContainer}>
            <Image source={{ uri: user.profilePicture || defaultProfilePic }} style={styles.profilePicture} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.fullName}>{user.firstName} {user.lastName}</Text>
              <Text style={styles.location}>{user.city}, {user.state}</Text>
            </View>
            {followingIds.includes(user.id) ? (
            <Button title="Unfollow" onPress={() => handleUnfollow(user.id)} />
            ) : (
            <Button title="Follow" onPress={() => handleFollow(user.id)} />
            )}
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