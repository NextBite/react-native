import React from 'react';
import { StackNavigator } from 'react-navigation';

import MarketMap from './MarketMap';
import MarketList from './MarketList';
import MarketPickups from './MarketPickups';
import ClaimListing from './ClaimListing';

const MarketNavigator = StackNavigator({
    MarketPickups: { screen: MarketPickups },
    ClaimListing: { screen: ClaimListing },
  },
    {
      initialRouteName: 'MarketPickups',
    }
  );

  export default MarketNavigator;