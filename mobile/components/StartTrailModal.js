import React from 'react';
import { View, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const StartTrailStack = createStackNavigator();

function StartTrailModalScreen(){
    return(
        <View>
          <Button title="Start Trail"/>
        </View>
    );
}

//modal that is nested within maintab navigator
export default function StartTrailStackScreen() {
  return (
    <StartTrailStack.Navigator mode="modal">
      <StartTrailStack.Screen name="Start Trail" component={StartTrailModalScreen} />
    </StartTrailStack.Navigator>
  );
}

