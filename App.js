import React from 'react';
import { StackNavigator } from 'react-navigation';

import MarketMap from './components/MarketMap';
import LocationPickups from './components/LocationPickups';

const App = StackNavigator({
  Home: { screen: MarketMap },
  LocationPickups: { screen: LocationPickups }
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