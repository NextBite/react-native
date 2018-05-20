import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Header } from 'native-base';
import MapView from 'react-native-maps';
import firebase from 'firebase';

import Icon from 'react-native-vector-icons/MaterialIcons';
import FetchLocation from './FetchLocation';
import UsersMap from './UsersMap';
import MapCards from './MapCards';
import HeaderComponent from './HeaderComponent';

export default class MarketMap extends React.Component {
  state = {
    userLocation: null,
    usersPlaces: [],
    markets: [],
    mapCards: [],
    marketDistance: [],
    countOfPickups: 0,
  }

  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Rescue Food';
    let drawerIcon = () => (
      <Icon 
        name= "location-on" 
        style={{color: "#44beac"}} 
        size={28} 
      />
    );
    return { drawerLabel, drawerIcon};
  }


  componentWillMount() {
    let usersPosition = {};
    let countOfPickups = this.state.countOfPickups;
    // get user's current location on load of map
    navigator.geolocation.getCurrentPosition(position => {
      console.log("possssss", position);
      //if (position.coords.latitude !== undefined) {
      console.log("pos", position);
      usersPosition = position;
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0421,
        }
      });

      // get the listings from the database
      /* Add a listener for changes to the listings object, and save in the state. */
      let marketsMarkersRef = firebase.database().ref('markets');
      marketsMarkersRef.on('value', (snapshot) => {
        let marketsArray = [];
        snapshot.forEach(function (child) {
          let market = child.val();
          market.key = child.key;
          marketsArray.push(market);
        });
        //listingArray.sort((a,b) => b.time - a.time); //reverse order
        this.setState({ markets: marketsArray });
      })
    });



    let marketsRef = firebase.database().ref('markets');

    marketsRef.on('value', (snapshot) => {
      let marketsArray = [];

      snapshot.forEach(function (child) {
        let marketListing = child.val();

        marketListing.key = child.key;
        marketsArray.push(marketListing);
      });

      marketsArray.map((market) => {
        let marketKeys = Object.keys(market);

        // take all keys except "key", which is just the unique id of the db obj, and "coords", which are the coordinates
        for (let i = 0; i < marketKeys.length - 2; i++) {
          let currentMarkets = this.state.markets;

          // only add market to the current markets if it hasn't been already
          if (!currentMarkets.includes(market.key)) {
            currentMarkets.push(market.key);
          }

          let marketListingsRef = firebase.database().ref(`markets/${market.key}/${marketKeys[i]}`);
          marketListingsRef.on('value', (snapshot) => {
            let marketListingsArray = [];
            snapshot.forEach(function (child) {
              let marketListing = child.val();
              marketListingsArray.push(marketListing);
            });


            if ((i + 3) == marketKeys.length) {

              countOfPickups += (marketKeys.length - 2);
              this.setState({ countOfPickups: countOfPickups });
            }


          })
        }
      })
    })



  } //end of component willmount

  getUserPlacesHandler = () => {
    fetch('https://nextbite-f8314.firebaseio.com/places.json')
      .then(res => res.json())
      .then(parsedRes => {
        const placesArray = [];
        for (const key in parsedRes) {
          placesArray.push({
            latitude: parsedRes[key].latitude,
            longitude: parsedRes[key].longitude,
            id: key
          });
        }

        this.setState({
          usersPlaces: placesArray
        });
      })
      .catch(err => console.log(err));
  }





  render() {

    console.log("MARKET CAARDS", this.state.mapCards)
    // generate markers for markets with current listings for the map
    // ***** slice is required due to code artifact that is adding keys unnecessarily to the array...
    let markers = this.state.markets.slice(0, this.state.markets.length / 2).map((market) => {
      let pos = { latitude: market.coords.lat, longitude: market.coords.long }

      return (
        <MapView.Marker
          coordinate={pos}
          key={market.key}
          title={market.key}
        />
      );
    })


    return (


      <View style={styles.container} >
      <Header style={{height: 0}} androidStatusBarColor='#35a08e'></Header>
        <UsersMap userLocation={this.state.userLocation} usersPlaces={this.state.usersPlaces} markers={markers} />
        <View style={styles.button}>
          <Button transparent
            style={styles.innerButton}
            onPress={() => this.props.navigation.navigate('MarketList', {})}
          >
            <Text style={styles.buttonText}>{this.state.countOfPickups} Pickups Available</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cards: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#44beac',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '10%'
  },
  innerButton: {
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  }
});
