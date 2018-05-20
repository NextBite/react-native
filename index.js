import { AppRegistry, Dimensions } from 'react-native';
import firebase from 'firebase';

import { DrawerNavigator } from 'react-navigation';

import MarketMap from './components/MarketMap';
import MarketList from './components/MarketList';
import MarketNavigator from './components/MarketNavigator';
import ProfileNavigator from './components/ProfileNavigator';
import MapNavigator from './components/MapNavigator';

var {height, width} = Dimensions.get('window');

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

const App = DrawerNavigator(routeConfigs, drawerNavigatorConfig);
AppRegistry.registerComponent('NextBite', () => App);
