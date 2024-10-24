import React, { act } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function ProfileScreen(){
    return(
        <View>
          <Image source={require('../assets/default-user-profile-pic.jpg')} style={styles.profilePicture} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}> John Doe </Text>
            <Text style={styles.location}> Kings Mountain, NC </Text>
          </View>
          
          <View style={styles.followContainer}>
            <View style={styles.followers}>
              <Text style={styles.followerNum}> 1 </Text>
              <Text style={styles.followerText}> follower </Text>
            </View>
            <View style={styles.following}>
              <Text style={styles.followingNum}> 1 </Text>
              <Text style={styles.followingText}> following </Text>
            </View>
          </View>

          <View style={styles.yearStatsContainer}>
            <Text style={styles.yearStatText}>2024 Stats</Text>

            <View style={styles.dataYearStatContainer}>
              <View style={styles.actContainer}>
                <Text style={styles.actNum}>2</Text>
                <Text style={styles.act}>Activities</Text>
              </View>
              <View style={styles.mileContainer}>
                <Text style={styles.mileNum}>4</Text>
                <Text style={styles.mile}>Miles</Text>
              </View>
            </View>

          </View>



        </View>
    )
};

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
  }

})