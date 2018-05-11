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
  },
  );

  export default MarketNavigator;