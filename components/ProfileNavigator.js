import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import Profile from './Profile';
import MarketMap from './MarketMap';

const ProfileNavigator = StackNavigator({
    Profile: { screen: Profile },
    MarketMap: { screen: MarketMap },
  },
    {
      initialRouteName: 'Profile',
      /* The header config from HomeScreen is now here */
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#44beac',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      },
    }
  );

  export default ProfileNavigator;