import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import Settings from './Settings';

const SettingsNavigator = StackNavigator({
    Settings: { screen: Settings, 
      navigationOptions: {
      header: null,
      } },

  },
    {
      initialRouteName: 'Settings',
    }
  );

  export default SettingsNavigator;