import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function OpeningPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Trailblazer</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Create Account"
        onPress={() => navigation.navigate('CreateAccount')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});