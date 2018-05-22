import { AppRegistry, Dimensions } from 'react-native';
import firebase from 'firebase';
import React, { Component } from 'react';

import { DrawerNavigator, SwitchNavigator, StackNavigator } from 'react-navigation';
import { Root } from 'native-base';

import ProfileNavigator from './components/ProfileNavigator';
import MapNavigator from './components/MapNavigator';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SignOut from './components/SignOut';

var { height, width } = Dimensions.get('window');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAS-lGtWLQDefNPadgIrUqM4weNwCFrsSo",
  authDomain: "nextbite-f8314.firebaseapp.com",
  databaseURL: "https://nextbite-f8314.firebaseio.com",
  projectId: "nextbite-f8314",
  storageBucket: "nextbite-f8314.appspot.com",
  messagingSenderId: "956642372530"
};
firebase.initializeApp(config);

let routeConfigs = {
  Map: {
    screen: MapNavigator,
  },
  Profile: {
    screen: ProfileNavigator,
  },
  SignOut: {
    screen: SignOut,
  }
}

let drawerNavigatorConfig = {
  initialRouteName: 'Map',
  drawerWidth: width * .60,
  drawerPosition: 'left',
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  drawerBackgroundColor: 'white',
  contentOptions: {
    activeTintColor: '#f8b718',
  }
};


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

// Switch between layouts depending on whether user is signed in or signed out
const createRootNavigator = (signedIn = false) => {
  return SwitchNavigator({
    SignedIn: {
      screen: DrawerNavigator(routeConfigs, drawerNavigatorConfig)
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

//const App = DrawerNavigator(routeConfigs, drawerNavigatorConfig);
//const App = SwitchNavigator(routeConfigs, drawerNavigatorConfig);
AppRegistry.registerComponent('NextBite', () => App);
