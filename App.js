import React from 'react';
import { StackNavigator } from 'react-navigation';

import MarketMap from './components/MarketMap';
import MarketPickups from './components/MarketPickups';
import ClaimListing from './components/ClaimListing';
import MarketList from './components/MarketList';
import DropOffLocation from './components/DropOffLocation';
import SuccessfulClaim from './components/SuccessfulClaim';

const App = StackNavigator({
  Home: { screen: MarketMap,
    navigationOptions: {
      header: null,
    } },
  MarketPickups: { screen: MarketPickups },
  ClaimListing: { screen: ClaimListing },
  MarketList: { screen: MarketList },
  DropOffLocation: { screen: DropOffLocation },
  SuccessfulClaim: { screen: SuccessfulClaim },
},
  {
    initialRouteName: 'Home',
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
