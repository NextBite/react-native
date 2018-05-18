import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import MarketMap from './MarketMap';
import MarketList from './MarketList';
import MarketPickups from './MarketPickups';
import ClaimListing from './ClaimListing';

const MapNavigator = StackNavigator({
    MarketMap: { screen: MarketMap },
    MarketList: { screen: MarketList },
    MarketPickups: { screen: MarketPickups },
    ClaimListing: { screen: ClaimListing },
  },
  {
    initialRouteName: 'MarketMap',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      header: null,
      }
  }
  );

  export default MapNavigator;