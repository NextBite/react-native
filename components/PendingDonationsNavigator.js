import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import PendingDonations from './PendingDonations';

const PendingDonationsNavigator = StackNavigator({
    PendingDonations: { screen: PendingDonations, 
      navigationOptions: {
      header: null,
      } },

  },
    {
      initialRouteName: 'PendingDonations',
    }
  );

  export default PendingDonationsNavigator;