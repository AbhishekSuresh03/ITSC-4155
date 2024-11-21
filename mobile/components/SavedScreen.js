import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function SavedScreen(){
    const { user } = useContext(AuthContext); // Access user and logout from AuthContext
    return(
        <View>
          <Text>
            This is the saved screen
          </Text>
          <Text>
            To access user information, use the AuthContext. Reference the JS to see how its utilized
          </Text>
          <Text>
            {user ? `Welcome ${user.username}` : 'Please log in'}
          </Text>
        </View>
    )
}