import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import MapNavigator from './components/MapNavigator';
import MarketNavigator from './components/MarketNavigator';
import ProfileNavigator from './components/ProfileNavigator';

import MarketMap from './components/MarketMap';
import MarketPickups from './components/MarketPickups';
import ClaimListing from './components/ClaimListing';
import MarketList from './components/MarketList';

const App = DrawerNavigator({
  RescueFood: { screen: MapNavigator },
  Markets: { screen: MarketNavigator },
  Profile: { screen: ProfileNavigator }
},
  {
    initialRouteName: 'RescueFood',
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

export default App;
