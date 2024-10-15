import React from 'react';
import CreateAccountView from './components/CreateAccountView';
import LoginAccountView from './components/LoginAccountView';
import StartTrailStackScreen from './components/StartTrailModal';
import ProfileScreen from './components/ProfileScreen';
import ExploreScreen from './components/ExploreScreen';
import SavedScreen from './components/SavedScreen';
import CommunityScreen from './components/CommunityScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//creating an instance of a stack navigator for the navigation container
const Stack = createStackNavigator();
//creating an instance of a bottom tab navigator for navigating within the app
const Tab = createBottomTabNavigator();


/*Navigation container is high level routing for the whole app, it has nested navigators within it
first page user sees is login, can switch to create account from there
after log in / create account, user is directed to main tab nav which is the actual app, defined after app function
*/
export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name='Login' component={LoginAccountView} options={{ title: 'Login'}}/>
        <Stack.Screen name='CreateAccount' component={CreateAccountView} options={{ title: 'Create Account'}}/>
        <Stack.Screen name='Main' component={MainTabNavigator} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// initialization of actual app view, this is nested within the navigation container
function MainTabNavigator(){
  return(
    <Tab.Navigator>
      <Tab.Screen name="Community"  component={CommunityScreen} options= {{ title: 'Community' }}/>
      <Tab.Screen name="Explore" component={ExploreScreen} options= {{ title: 'Explore' }}/>
      <Tab.Screen name="Start Trail" component={StartTrailStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Saved" component={SavedScreen} options= {{ title: 'Saved' }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options= {{ title: 'Profile' }}/>
    </Tab.Navigator>
    )
}



