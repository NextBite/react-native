import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import MarketMap from './MarketMap';
import MarketPickups from './MarketPickups';
import ClaimListing from './ClaimListing';
import MarketList from './MarketList';

const MarketNavigator = StackNavigator({
    MarketList: { screen: MarketList },
    MarketPickups: { screen: MarketPickups },
    ClaimListing: { screen: ClaimListing },
    MarketMap: { screen: MarketMap },
  },
    {
      initialRouteName: 'MarketList',
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

  export default MarketNavigator;