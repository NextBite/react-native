
import { AppRegistry, Dimensions } from 'react-native';
import firebase from 'firebase';
import React, { Component } from 'react';
import bgMessaging from './components/bgMessaging'; 

import { DrawerNavigator, SwitchNavigator, StackNavigator } from 'react-navigation';
import { Root } from 'native-base';

import ProfileNavigator from './components/ProfileNavigator';
import MapNavigator from './components/MapNavigator';
import Listing from './components/Listing';

import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SignOut from './components/SignOut';
import VolunteerPendingRescues from './components/VolunteerPendingRescues';

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
        this.setState({ userId: user.uid })
        var profileRef = firebase.database().ref('users/' + this.state.userId);
        profileRef.once("value")
          .then(snapshot => {
            this.setState({personType: snapshot.child("personType").val()});
            personType = this.state.personType;
          });
      }
    });
  }

  render() {
    const { signedIn } = this.state;

    let routeConfigs = {
      Home: {
        screen: this.state.personType === 'volunteer' ? MapNavigator : Listing,
      },
      VolunteerPendingRescues: {
        screen: VolunteerPendingRescues,
      },
      Profile: {
        screen: ProfileNavigator,
      },
      SignOut: {
        screen: SignOut,
      }
    }
    
    let drawerNavigatorConfig = {
      initialRouteName: 'Home',
      drawerWidth: width * .60,
      drawerPosition: 'left',
      drawerOpenRoute: 'DrawerOpen',
      drawerCloseRoute: 'DrawerClose',
      drawerToggleRoute: 'DrawerToggle',
      drawerBackgroundColor: 'white',
      drawerColor: '#44beac',
      contentOptions: {
        activeTintColor: '#f8b718',
        inactiveTintColor: '#474748',
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
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);
