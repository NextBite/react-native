import { AppRegistry, Dimensions } from 'react-native';
import firebase from 'firebase';

import { DrawerNavigator } from 'react-navigation';

import MarketMap from './components/MarketMap';
import MarketList from './components/MarketList';
import Profile from './components/Profile';

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
    MarketMap: { 
        screen: MarketMap,
    },
    MarketList: {
        screen: MarketList,
    },
    Profile: {
        screen: Profile,
    }
}

let drawerNavigatorConfig = {    
    initialRouteName: 'MarketMap',
    drawerWidth: width / 2,
    drawerPosition: 'left',
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',  
    // drawerBackgroundColor: 'orange',
    contentOptions: {
        activeTintColor: 'red',
    },
};

const App = DrawerNavigator(routeConfigs, drawerNavigatorConfig);
AppRegistry.registerComponent('NextBite', () => App);
