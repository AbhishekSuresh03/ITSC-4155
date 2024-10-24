import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-elements';

export default function CommunityScreen(){
    return(
      <View style={styles.pageContainer}>
      <Card style={styles.cardContainer}>
        <Card.Title>My Awesome Card</Card.Title>
        <Card.Divider />
        <Text style={{ marginBottom: 10 }}>
          This is a card created using React Native Elements. It is very easy to use and looks great!
        </Text>
        <Button
          title="Click Me"
          onPress={() => alert('Button inside card pressed!')}
        />
      </Card>
    </View>
    )
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16
  }, 
  cardContainer:{
    
  },
  title: {

  },
  text: {

  }
});