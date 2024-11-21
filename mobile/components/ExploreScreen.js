import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { getAllUsers } from '../service/userService';
const defaultProfilePic = require('../assets/default-user-profile-pic.jpg');

// const users = [
//   {
//     id: 1,
//     firstName: 'CJ',
//     lastName: 'Carrier',
//     userName: 'Cj_Carrier',
//     email: 'cjcarrier7@gmail.com',
//     password: '123',
//     city: 'Charlotte',
//     state: 'North Carolina',
//     profilePic: defaultProfilePic,
//     trails: ['1', '2', '3'],
//   },
//   {
//     id: 2,
//     firstName: 'John',
//     lastName: 'Doe',
//     userName: 'John_Doe',
//     email: 'john.doe@example.com',
//     password: 'password',
//     city: 'New York',
//     state: 'New York',
//     profilePic: defaultProfilePic,
//     trails: ['4', '5'],
//   },
// ];

export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users);

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
});