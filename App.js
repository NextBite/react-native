import React from 'react';
import { StackNavigator } from 'react-navigation';

import MarketMap from './components/MarketMap';
import MarketPickups from './components/MarketPickups';

const App = StackNavigator({
  Home: { screen: MarketMap },
  MarketPickups: { screen: MarketPickups }
},
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

export default App;