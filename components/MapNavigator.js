import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import MarketMap from './MarketMap';
import MarketNavigator from './MarketNavigator';

const MapNavigator = StackNavigator({
    MarketMap: { screen: MarketMap },
  },
  {
    initialRouteName: 'MarketMap',
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

  export default MapNavigator;