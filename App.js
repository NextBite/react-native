import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import MapView from 'react-native-maps';
import firebase from 'firebase';

import FetchLocation from './components/FetchLocation';
import UsersMap from './components/UsersMap';
import MapCards from './components/MapCards';

export default class App extends React.Component {
  state = {
    userLocation: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0622,
      longitudeDelta: 0.0421,
    },
    usersPlaces: [],
    markets: [],
    mapCards: []
  }

  componentDidMount() {
    // get user's current location on load of map
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0421,
        }
      });
    });

    // get the listings from the database
    /* Add a listener for changes to the listings object, and save in the state. */
    let marketsMarkersRef = firebase.database().ref('markets');
    marketsMarkersRef.on('value', (snapshot) => {
      var marketsArray = [];
      snapshot.forEach(function (child) {
        var market = child.val();
        market.key = child.key;
        marketsArray.push(market);
      });
      //listingArray.sort((a,b) => b.time - a.time); //reverse order
      this.setState({ markets: marketsArray });
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

          if (!currentMarkets.includes(market.key)) {
            currentMarkets.push(market.key);
          }

          var marketListingsRef = firebase.database().ref(`markets/${market.key}/${marketKeys[i]}`);
          marketListingsRef.on('value', (snapshot) => {
            var marketListingsArray = [];
            snapshot.forEach(function (child) {
              var marketListing = child.val();
              marketListingsArray.push(marketListing);
            });

            if ((i + 3) == marketKeys.length) {
              let currentMapCards = this.state.mapCards;
              this.setState({currentMarket: market.key})
              currentMapCards.push(
                <MapCards
                title={market.key}
                count={marketKeys.length - 2}
                key={market.key}
                />
              )
              this.setState({ mapCards: currentMapCards })
            }
          })
        }
      })
    });
  }

  // when get location button is pressed, new location is calculated
  // plus coords are added to db
  getUserLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0421,
        }
      });

      // one argument only would send a GET request instead
      fetch('https://nextbite-f8314.firebaseio.com/places.json', {
        method: 'POST',
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }, err => console.log(err));
  }

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
    let markers = this.state.markets.slice(0, this.state.markets.length/2).map((market) => {
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
      <View style={styles.container}>
        <UsersMap userLocation={this.state.userLocation} usersPlaces={this.state.usersPlaces} markers={markers}/>

        <ScrollView style={styles.cards}>
          {this.state.mapCards}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cards: {
    width: '100%',
    height: '100%',
  }
});
