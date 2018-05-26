import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import Listing from './Listing';
import PendingDonations from './PendingDonations';

const ListingNavigator = StackNavigator({
  Listing: { screen: Listing },
  PendingDonations: { screen: PendingDonations },
},
  {
    initialRouteName: 'Listing',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      header: null,
    }
  }
);

export default ListingNavigator;