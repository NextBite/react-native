import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import PendingDonations from './PendingDonations';
import EditRescue from './EditRescue';

const PendingDonationsNavigator = StackNavigator({
  PendingDonations: { screen: PendingDonations },
  EditRescue: { screen: EditRescue },
  },
    {
      initialRouteName: 'PendingDonations',
      navigationOptions: {
        header: null,
        }
    }
  );

  export default PendingDonationsNavigator;