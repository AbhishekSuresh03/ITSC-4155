import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import { sanitizeSearchQuery } from '../utils/sanitize.js';
const defaultImage = require('../assets/icon.png');


export default function CommunityScreen() {
  const [search, setSearch] = React.useState('');
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
      image: require('../assets/trail1.jpg'),
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
      // No image provided for this trail
    },
    // Add more trail objects here
  ];

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Find trails"
        onChangeText={(text) => setSearch(sanitizeSearchQuery(text))} // Sanitize input
        value={search}
        lightTheme
        round
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        {trails
          .filter((trail) => trail.name.toLowerCase().includes(search.toLowerCase())) // Filter results by sanitized search
          .map((trail) => (
            <View key={trail.id} style={styles.trailContainer}>
              <Image source={trail.image || defaultImage} style={styles.trailImage} />
              <Text style={styles.trailName}>{trail.name}</Text>
              <Text style={styles.trailLocation}>
                {trail.city}, {trail.state}
              </Text>
              <Text style={styles.trailDetails}>
                <Icon name="star" type="font-awesome" color="#f50" size={12} /> {trail.rating} | {trail.difficulty} |{' '}
                {trail.length} | {trail.time}
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
    //backgroundColor: 'red',
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
});