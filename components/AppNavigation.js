import React from 'react'
import { Text } from 'react-native'
import { StackNavigator, DrawerNavigator } from 'react-navigation'

import MarketMap from './MarketMap';
import MarketPickups from './MarketPickups';
import ClaimListing from './ClaimListing';
import MarketList from './MarketList';


// drawer stack
const DrawerStack = DrawerNavigator({
  MarketPickups: { screen: MarketPickups },
})

const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack }
})

// login stack
const LoginStack = StackNavigator({
    Home: { screen: MarketMap,
        navigationOptions: {
          header: null,
        } },
      MarketPickups: { screen: MarketPickups },
      ClaimListing: { screen: ClaimListing },
      MarketList: { screen: MarketList },
    }, {
      headerMode: 'float',
      navigationOptions: ({navigation}) => ({
        headerStyle: {backgroundColor: 'green'},
        headerLeft: <Text onPress={() => navigation.navigate('DrawerOpen')}>Menu</Text>
      })
})

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LoginStack: { screen: LoginStack },
  DrawerStack: { screen: DrawerNavigation }
}, {
  // Default config for all screens
  headerMode: 'none',
  title: 'Main',
  initialRouteName: 'LoginStack'
})

export default PrimaryNav;