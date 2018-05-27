
import { AppRegistry, Dimensions } from 'react-native';
import firebase from 'firebase';
import RNfirebase from 'react-native-firebase';
import React, { Component } from 'react';
import bgMessaging from './components/bgMessaging';

import { DrawerNavigator, SwitchNavigator, StackNavigator } from 'react-navigation';
import { Root } from 'native-base';

import ProfileNavigator from './components/ProfileNavigator';
import MapNavigator from './components/MapNavigator';
import ListingNavigator from './components/ListingNavigator';

import Home from './components/Home';
import Profile from './components/Profile';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SignOut from './components/SignOut';
import VolunteerPendingRescues from './components/VolunteerPendingRescues';
import PendingDonations from './components/PendingDonations';
import VolunteerRescueHistory from './components/VolunteerRescueHistory';
import VendorRescueHistory from './components/VendorRescueHistory';

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
            this.setState({ personType: snapshot.child("personType").val() });
            personType = this.state.personType;
          });

        this.onTokenRefreshListener = RNfirebase.messaging().onTokenRefresh(fcmToken => {
          // Process your token as required
          firebase.database().ref(`users/${this.state.userId}`)
          .update({ fcmToken: fcmToken });
        });

        RNfirebase.messaging().getToken()
          .then(fcmToken => {
            console.log("token", fcmToken);
            console.log("user", this.state.userId);
            if (fcmToken) {
              // user has a device token
              firebase.database().ref(`users/${this.state.userId}`)
              .update({ fcmToken: fcmToken });
            } else {
              // user doesn't have a device token yet
              firebase.database().ref(`users/${this.state.userId}`)
              .update({ fcmToken: 'no' });
            }
          });

        // Build a channel
        const channel = new RNfirebase.notifications.Android.Channel('new-listing-channel', 'New Listing Channel', RNfirebase.notifications.Android.Importance.Max)
          .setDescription('NextBite\'s New Listing Channel');

        if (this.state.personType === 'volunteer') {
          // every volunteer is part of the new listing topic; this means
          // everyone gets a new notification when a listing is posted
          RNfirebase.messaging().subscribeToTopic('newListing');
        }

        RNfirebase.messaging().hasPermission()
          .then(enabled => {
            if (enabled) {
              // user has permissions
              console.log("enabled permission");

              // for displaying notifications made inside the app manually
              // make a func to create the notification and assign it to the channel
              this.notificationDisplayedListener = RNfirebase.notifications().onNotificationDisplayed((notification) => {
                // Process your notification as required
                // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
                console.log("in app made notification", notification);
              });

              // msg sent via firebase cloud function (subscription to newListing topic)
              // foreground?? and background
              this.notificationOpenedListener = RNfirebase.notifications().onNotificationOpened((notificationOpen) => {
                // Get the action triggered by the notification being opened
                const action = notificationOpen.action;
                // Get information about the notification that was opened
                const notification = notificationOpen.notification;
                notification.android.setChannelId('new-listing-channel');
                console.log("cloud func fore/bg");
              });

              // msg sent via firebase cloud function (subscription to newListing topic)
              // closed or msg sent from firebase console
              RNfirebase.notifications().getInitialNotification()
                .then((notificationOpen) => {
                  if (notificationOpen) {
                    // App was opened by a notification
                    // Get the action triggered by the notification being opened
                    const action = notificationOpen.action;
                    // Get information about the notification that was opened
                    const notification = notificationOpen.notification;
                    notification.android.setChannelId('new-listing-channel');
                    console.log("closed");
                  }
                });
            } else {
              // user doesn't have permission
              console.log("no permission");
              RNfirebase.messaging().requestPermission()
                .then(() => {
                  // User has authorised  
                  // for displaying notifications made inside the app manually
                  // make a func to create the notification and assign it to the channel
                  this.notificationDisplayedListener = RNfirebase.notifications().onNotificationDisplayed((notification) => {
                    // Process your notification as required
                    // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
                    console.log("in app made notification", notification);
                  });

                  // msg sent via firebase cloud function (subscription to newListing topic)
                  // foreground?? and background
                  this.notificationOpenedListener = RNfirebase.notifications().onNotificationOpened((notificationOpen) => {
                    // Get the action triggered by the notification being opened
                    const action = notificationOpen.action;
                    // Get information about the notification that was opened
                    const notification = notificationOpen.notification;
                    notification.android.setChannelId('new-listing-channel');
                    console.log("cloud func fore/bg");
                  });

                  // msg sent via firebase cloud function (subscription to newListing topic)
                  // closed or msg sent from firebase console
                  RNfirebase.notifications().getInitialNotification()
                    .then((notificationOpen) => {
                      if (notificationOpen) {
                        // App was opened by a notification
                        // Get the action triggered by the notification being opened
                        const action = notificationOpen.action;
                        // Get information about the notification that was opened
                        const notification = notificationOpen.notification;
                        notification.android.setChannelId('new-listing-channel');
                        console.log("closed");
                      }
                    });
                })
                .catch(error => {
                  // User has rejected permissions  
                });
            }
          });
      }
    });
  }

  componentWillUnmount() {
    this.onTokenRefreshListener();
  }

  render() {
    const { signedIn } = this.state;

    let routeConfigs = {
      Home: {
        screen: this.state.personType === undefined ? Profile : (this.state.personType === 'volunteer' ? MapNavigator : ListingNavigator),
      },
      Pending: {
        screen: this.state.personType === 'volunteer' ? VolunteerPendingRescues : PendingDonations,
      },
      History: {
        screen: this.state.personType === 'volunteer' ? VolunteerRescueHistory : VendorRescueHistory
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
