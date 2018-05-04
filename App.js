import React from 'react';
import { StackNavigator } from 'react-navigation';

import MarketMap from './components/MarketMap';
import MarketPickups from './components/MarketPickups';
import ClaimListing from './components/ClaimListing';
import MarketList from './components/MarketList';

const App = StackNavigator({
  Home: { screen: MarketMap,
    navigationOptions: {
      header: null,
    } },
  MarketPickups: { screen: MarketPickups },
  ClaimListing: { screen: ClaimListing },
  MarketList: { screen: MarketList },
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
