import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { Text } from 'react-native';

import MapNavigator from './components/MapNavigator';
import MarketNavigator from './components/MarketNavigator';
import ProfileNavigator from './components/ProfileNavigator';

import Profile from './components/Profile'
import MarketMap from './components/MarketMap';
import MarketPickups from './components/MarketPickups';
import ClaimListing from './components/ClaimListing';
import MarketList from './components/MarketList';

// drawer stack
const DrawerStack = DrawerNavigator({
  Profile: { screen: Profile },
  MarketList: { screen: MarketList }
})

const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack }
}, {
  navigationOptions: ({navigation}) => ({
    headerStyle: {backgroundColor: 'green'},
    title: 'Logged In to your app!',
    headerLeft: <Text onPress={() => navigation.navigate('DrawerOpen')}>Menu</Text>
  })
})

// login stack
const LoginStack = StackNavigator({
  MarketMap: { screen: MapNavigator },
  MarketList: { screen: MarketNavigator }
}, {
  navigationOptions: {
    headerStyle: {backgroundColor: 'red'},
    title: 'You are not logged in'
  }
})


// Manifest of possible screens
const App = StackNavigator({
  loginStack: { screen: LoginStack },
  drawerStack: { screen: DrawerNavigation }
}, {
  // Default config for all screens
  headerMode: 'none',
  title: 'Main',
  initialRouteName: 'loginStack'
})

export default App
