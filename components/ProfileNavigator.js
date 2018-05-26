import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import Profile from './Profile';
import MarketMap from './MarketMap';

const ProfileNavigator = StackNavigator({
    Profile: { screen: Profile, 
      navigationOptions: {
      header: null,
      } },

  },
    {
      initialRouteName: 'Profile',
    }
  );

  export default ProfileNavigator;