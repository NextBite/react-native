import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import VolunteerPendingRescues from './VolunteerPendingRescues';

const VolunteerPendingRescuesNavigator = StackNavigator({
    VolunteerPendingRescues: { screen: VolunteerPendingRescues, 
      navigationOptions: {
      header: null,
      } },

  },
    {
      initialRouteName: 'VolunteerPendingRescues',
    }
  );

  export default VolunteerPendingRescuesNavigator;