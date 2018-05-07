'use strict';

import React, { Component } from 'react';
import { Root } from 'native-base';
import { StackNavigator, SwitchNavigator } from 'react-navigation';
import firebase from 'firebase';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import HomePage from './components/HomePage';
import MarketMap from './components/MarketMap';
import LocationPickups from './components/LocationPickups';

// Layout when user is signed out
const SignedOut = StackNavigator({
  SignUp: {
    screen: SignUp,
  },
  SignIn: {
    screen: SignIn,
  }
},
  {
    initialRouteName: "SignIn"
  }
);

// Layout when user signs in or has previously signed in
const SignedIn = StackNavigator({
  Home: {
    screen: HomePage
  },
  MarketMap: {
    screen: MarketMap
  },
  LocationPickups: {
    screen: LocationPickups
  }
},
  {
    initialRouteName: "Home",
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

// Switch between layouts depending on whether user is signed in or signed out
const createRootNavigator = (signedIn = false) => {
  return SwitchNavigator({
    SignedIn: {
      screen: SignedIn
    },
    SignedOut: {
      screen: SignedOut
    }
  },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
    };
  }

  componentDidMount() {
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if (user) { 
        // user is signed in
        this.setState({ signedIn: true })
      }
    });
  }

  render() {
    const { signedIn } = this.state;
    const Layout = createRootNavigator(signedIn);

    return (
      <Root>
        <Layout />
      </Root>
    );
  }
}