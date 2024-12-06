import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { fetchTrailsByUserId } from '../service/trailService';
import { fetchUserById } from '../service/userService';
import { formatTime } from '../utils/formattingUtil';


export default function ProfileScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Photos');
  const { user, logout } = useContext(AuthContext); // Access user and logout from AuthContext
  const [trails, setTrails] = useState([]);
  const [totalMiles, setTotalMiles] = useState(0);
  const [trailPictures, setTrailPictures] = useState([]);
  const [followers , setFollowers] = useState([]);
  const [following , setFollowing] = useState([]);



  useEffect(() => {
    const loadUserData = async () => {
      try {
        const updatedUser = await fetchUserById(user.id);
        setFollowers(updatedUser.followers);
        setFollowing(updatedUser.following);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const loadTrails = async () => {
      try {
        const fetchedTrails = await fetchTrailsByUserId(user.id);
        console.log('Fetched Trails:', fetchedTrails); // Verify data
        setTrails(fetchedTrails);
        const pictures = getTrailPictures(fetchedTrails);
        setTrailPictures(pictures);
        const miles = fetchedTrails.reduce((sum, trail) => sum + (trail.length || 0), 0).toFixed(2); // dont even ask how this works, it just does.
        setTotalMiles(miles);
      } catch (error) {
        console.error('Error fetching trails:', error);
      }
    };
  
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
      loadTrails();
    });
  
    return unsubscribe;
  }, [navigation]);

  function getTrailPictures(trails) {
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
  }
  const handleLogout = async () => {
    try {
      await logout();
       // Navigate to the Opening screen after logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const renderContent = () => {
    console.log(trails);
    switch (activeTab) {
      case 'Feed':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>Nothing from feed to currently display!</Text>
            <Image source={require('../assets/emptyProfileNav.png')} style={styles.emptyPicture} />
          </View>
        );
      case 'Photos':
        return (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {trailPictures.length === 0 ? (
              <View style={styles.contentContainer}>
                <Text style={styles.contentText}>No photos to currently display!</Text>
                <Image source={require('../assets/emptyProfileNav.png')} style={styles.emptyPicture} />
              </View>
            ) : (
              <View style={styles.imageGrid}>
                {trailPictures.map((picture, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: picture }} style={styles.image} />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        );
      case 'Activities':
        return (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {trails.length === 0 ? (
              <View style={styles.contentContainer}>
                <Text style={styles.contentText}>No activities to display!</Text>
                <Image source={require('../assets/emptyProfileNav.png')} style={styles.emptyPicture} />
              </View>
            ) : (
              trails.map((trail) => (
                <View style={styles.trailCard} key={trail.id}>
                  <Image source={{ uri: trail.primaryImage }} style={styles.trailImage} />
                  <View style={styles.trailInfo}>
                    <Text style={styles.trailName}>{trail.name}</Text>
                    <Text style={styles.trailLocation}>{trail.city}, {trail.state}</Text>
                    <Text style={styles.trailDetails}>{trail.difficulty} | {trail.length.toFixed(2)} Miles | {formatTime(trail.time)}</Text>
                    <Text style={styles.trailDescription}>
                      {trail.description.length > 100 ? `${trail.description.slice(0, 100)}...` : trail.description}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        );
      default:
        return null;
    }
  };


  if(!user){
    navigation.navigate('OpeningScreen')
    return(
      <Text>Not logged in</Text>
    )
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
          <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.location}>{user.city}, {user.state}</Text>
      </View>

      
      <View style={styles.followContainer}>
        <View style={styles.followers}>
          <Text style={styles.followerNum}>{followers.length}</Text>
          <Text style={styles.followerText}>followers</Text>
        </View>
        <View style={styles.following}>
          <Text style={styles.followingNum}>{following.length}</Text>
          <Text style={styles.followingText}>following</Text>
        </View>
      </View>

      <View style={styles.yearStatsContainer}>
        <Text style={styles.yearStatText}>2024 Stats</Text>
        <View style={styles.dataYearStatContainer}>
          <View style={styles.actContainer}>
            <Text style={styles.actNum}>{trails.length}</Text>
            <Text style={styles.act}>Trails</Text>
          </View>
          <View style={styles.mileContainer}>
            <Text style={styles.mileNum}>{totalMiles}</Text>
            <Text style={styles.mile}>Miles</Text>
          </View>
        </View>
      </View>

      <ScrollView horizontal={true} style={styles.navbar} showsHorizontalScrollIndicator={false}>
        
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Photos')}>
          <Text style={[styles.navText, activeTab === 'Photos' && styles.activeNavText]}>Photos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Activities')}>
          <Text style={[styles.navText, activeTab === 'Activities' && styles.activeNavText]}>Activities</Text>
        </TouchableOpacity>
        
      </ScrollView>

      <View style={styles.bottomHalf}>
        {renderContent()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
},
  logoutButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    marginRight:15,
    borderRadius: 5,
},
logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
},
  profilePicture: {
    width: 150,
    height: 150, 
    borderRadius: 80,
    marginTop: 75,
    marginLeft: 15,
  },
  followerContainer: {
    backgroundColor: 'gray'
  },
  nameContainer: {
    marginHorizontal: 15,
    marginTop: 15
  },
  name:{
    fontSize: 30,
    fontWeight: "bold",
  },
  location: {
    marginVertical: 5,
    fontSize: 15,
    fontWeight: "bold"
  },
  followContainer: {
    marginHorizontal: 15,
    flexDirection: 'row',
    paddingBottom: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.5)'
  },
  followers: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(128, 128, 128, 0.5)',
    paddingRight: 10
  },
  following: {
    paddingLeft: 10
  },
  followingNum: {
    fontWeight: "bold"
  },
  followerNum: {
    fontWeight: "bold"
  },
  yearStatsContainer: {
    marginHorizontal: 15,
    marginVertical: 30,
    backgroundColor: "lightgray",
    borderRadius: 10,
    height: 165,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 5, 
  },
  yearStatText: {
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 20,
    marginHorizontal: 10
  },
  dataYearStatContainer: {
    flexDirection: "row",
    marginRight: 80
  },
  actContainer: {
    flex: 1,
    paddingLeft: 25,
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(128, 128, 128, 0.5)',
    paddingBottom: 0
  },
  mileContainer: {
    flex: 1,
    paddingLeft: 25
  },
  mile: {
    fontSize: 12.5,
    fontWeight: "bold"
  },
  act: {
    fontSize: 12.5,
    fontWeight: "bold"
  },
  actNum: {
    fontSize: 40,
    paddingTop: 0
  },
  mileNum: {
    fontSize: 40
  }, 
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 50,
  },
  navItem: {
    marginHorizontal: 20,
    justifyContent: "center"
  },
  navText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activeNavText: {
    color: '#FFC107',
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: 'black'
  },
  bottomHalf: {
    flex: 1,
    padding: 16,
  },
  contentText: {
    fontSize: 18,
    marginBottom: 20,
  },
  emptyPicture: {
    height: 175,
    width: 200,
    borderRadius: 50
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardLocation: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
  },
  cardDetails: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#333',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    marginBottom: 20,
  },
  emptyPicture: {
    height: 175,
    width: 200,
    borderRadius: 50,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  imageWrapper: {
    width: '48%',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
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
});