import React from 'react';
import { StackNavigator } from 'react-navigation';

import MarketMap from './MarketMap';
import MarketPickups from './MarketPickups';
import ClaimListing from './ClaimListing';
import MarketList from './MarketList';
import DropOffLocation from './DropOffLocation';
import SuccessfulClaim from './SuccessfulClaim';
import VolunteerPendingRescues from './VolunteerPendingRescues';

const MarketNavigator = StackNavigator({
  MarketPickups: { screen: MarketPickups },
  MarketList: { screen: MarketList },
  ClaimListing: { screen: ClaimListing },
  DropOffLocation: { screen: DropOffLocation },
  SuccessfulClaim: { screen: SuccessfulClaim },
  VolunteerPendingRescues: { screen: VolunteerPendingRescues },
  },
    {
      initialRouteName: 'MarketPickups',
      navigationOptions: {
        header: null,
        }
    }
  );

  export default MarketNavigator;