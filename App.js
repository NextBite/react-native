import React from 'react';
import { StackNavigator } from 'react-navigation';
import RNfirebase from 'react-native-firebase';

import MarketMap from './components/MarketMap';
import MarketPickups from './components/MarketPickups';
import ClaimListing from './components/ClaimListing';
import MarketList from './components/MarketList';
import DropOffLocation from './components/DropOffLocation';
import SuccessfulClaim from './components/SuccessfulClaim';
import VolunteerPendingRescues from './components/VolunteerPendingRescues';

const App = StackNavigator({
  Home: {
    screen: MarketMap,
    navigationOptions: {
      header: null,
    }
  },
  MarketPickups: { screen: MarketPickups },
  ClaimListing: { screen: ClaimListing },
  MarketList: { screen: MarketList },
  DropOffLocation: { screen: DropOffLocation },
  SuccessfulClaim: { screen: SuccessfulClaim },
  VolunteerPendingRescues: { screen: VolunteerPendingRescues },
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

// Build a channel
const channel = new RNfirebase.notifications.Android.Channel('new-listing-channel', 'New Listing Channel', RNfirebase.notifications.Android.Importance.Max)
  .setDescription('NextBite\'s New Listing Channel');

// every volunteer is part of the new listing topic; this means
// everyone gets a new notification when a listing is posted
RNfirebase.messaging().subscribeToTopic('newListing');

// else vendor get their fcm token and add to the firebase

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

export default App;
