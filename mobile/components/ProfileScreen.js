import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen(){
  const [activeTab, setActiveTab] = useState('Feed');
  const { user, logout } = useContext(AuthContext); // Access user and logout from AuthContext
  
  const handleLogout = async () => {
    await logout();
    navigation.navigate('Main'); // mavigate to Login screen after logout
  };

  const renderContent = () => {
      switch (activeTab) {
          case 'Feed':
              return( 
              <View style={styles.contentContainer}>
                  <Text style={styles.contentText}>Nothing from feed to currently display!</Text>
                  <Image source={require('../assets/emptyProfileNav.png')}style={styles.emptyPicture}/>
              </View>
              );
          case 'Photos':
              return (
              <View style={styles.contentContainer}>
                <Text style={styles.contentText}>No photos to currently display!</Text>
                <Image source={require('../assets/emptyProfileNav.png')}style={styles.emptyPicture}/>
              </View>
              );
          case 'Reviews':
              return (
              <View style={styles.contentContainer}>
                <Text style={styles.contentText}>No reviews to currently display!</Text>
                <Image source={require('../assets/emptyProfileNav.png')}style={styles.emptyPicture}/>
              </View>
              );
          case 'Activities':
              return (
              <View style={styles.contentContainer}>
                <Text style={styles.contentText}>No activities to display!</Text>
                <Image source={require('../assets/emptyProfileNav.png')}style={styles.emptyPicture}/>
              </View>
              );
          case 'Completed':
              return (
              <View style={styles.contentContainer}>
                <Text style={styles.contentText}>No completed trails to display!</Text>
                <Image source={require('../assets/emptyProfileNav.png')}style={styles.emptyPicture}/>
              </View>
              );
              default:
                return null;
      }
  };
  //ensuring user is logged in

  if (!user) {
    return (
        //TODO: Update this to reference the login screen
        // could merge the login screen with the profile screen to make it easier to navigate
        //or just delete this if we show the login screen before the user can access the rest of the app
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.message}>You are not logged in.</Text>
        </View>
    );
}

  return(
    <ScrollView style={styles.container}>
          <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.location}>{user.city}, {user.state}</Text>
          </View>
          
          

          <View style={styles.yearStatsContainer}>
            <Text style={styles.yearStatText}>2024 Stats</Text>

            <View style={styles.dataYearStatContainer}>
              <View style={styles.actContainer}>
                <Text style={styles.actNum}>{/*user.activities.length*/5}</Text>
                <Text style={styles.act}>Activities</Text>
              </View>
              <View style={styles.mileContainer}>
                <Text style={styles.mileNum}>{user.miles}</Text>
                <Text style={styles.mile}>Miles</Text>
              </View>
            </View>
          </View>

          <ScrollView horizontal={true} style={styles.navbar} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Feed')}>
              <Text style={[styles.navText, activeTab === 'Feed' && styles.activeNavText]}>Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Photos')}>
              <Text style={[styles.navText, activeTab === 'Photos' && styles.activeNavText]}>Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Reviews')}>
              <Text style={[styles.navText, activeTab === 'Reviews' && styles.activeNavText]}>Reviews</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Activities')}>
              <Text style={[styles.navText, activeTab === 'Activities' && styles.activeNavText]}>Activities</Text>
            </TouchableOpacity>    
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Completed')}>
              <Text style={[styles.navText, activeTab === 'Completed' && styles.activeNavText]}>Completed</Text>
            </TouchableOpacity>
          </ScrollView>
        
          <View style={styles.bottomHalf}>
              {renderContent()}
          </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  profilePicture: {
    width: 85,
    height: 85, 
    borderRadius: 50,
    marginTop: 75,
    marginLeft: 15
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
    marginRight: 80,
  },
  actContainer: {
    flex: 1,
    paddingLeft: 25,
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(128, 128, 128, 0.5)',
    paddingBottom: 0,
  },
  mileContainer: {
    flex: 1,
    paddingLeft: 25
    },
  mile: {
    fontSize: 12.5,
    fontWeight: "bold",
  },
  act: {
    fontSize: 12.5,
    fontWeight: "bold",
  },
  actNum: {
    fontSize: 55,
    paddingTop: 0,
  },
  mileNum: {
    fontSize: 55
  }, 
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
},
topHalf: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
},
profileHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
}

});