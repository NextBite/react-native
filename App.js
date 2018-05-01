import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import MapView from 'react-native-maps';
import firebase from 'firebase';
import geolib from 'geolib';

import FetchLocation from './components/FetchLocation';
import UsersMap from './components/UsersMap';
import MapCards from './components/MapCards';

export default class App extends React.Component {
  state = {
    userLocation: null,
    usersPlaces: [],
    markets: [],
    mapCards: [],
    marketDistance: [],
  }

  componentDidMount() {
    let usersPosition = {};
    // get user's current location on load of map
    navigator.geolocation.getCurrentPosition(position => {
      usersPosition = position;
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
      let marketsArray = [];
      snapshot.forEach(function (child) {
        let market = child.val();
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

            // last two entires are the coords and keys, so skip over those to check
            // if ending has been reached yet
            if ((i + 3) == marketKeys.length) {
              let currentMapCards = this.state.mapCards;
              this.setState({ currentMarket: market.key })
              console.log("market before card", market);
              console.log(usersPosition.coords)
              console.log("geolib", geolib.getDistance(usersPosition.coords, { latitude: market.coords.lat, longitude: market.coords.long }, 1, 3));

              // calls the google api to calculate distance between user's location 
              // and the geo markers (markets)
              let responseDistance = "";
              fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${usersPosition.coords.latitude},${usersPosition.coords.longitude}&destinations=${market.coords.lat},${market.coords.long}&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE`)
                .then(res => res.json())
                .then(parsedRes => {
                  responseDistance = parsedRes.rows[0].elements[0].distance.text;
                })
                .then(() => {
                  currentMapCards.push(
                    <MapCards
                      title={market.key}
                      count={marketKeys.length - 2}
                      key={market.key}
                      distance={responseDistance}
                    />
                  )

                  // sort the cards by smallest to largest according to distance away from user
                  currentMapCards.sort(function(a, b) {
                    return parseFloat(a.props.distance) - parseFloat(b.props.distance);
                  });

                  this.setState({ mapCards: currentMapCards })
                })
                .catch(err => console.log(err));
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
      <View style={styles.container}>
        <UsersMap userLocation={this.state.userLocation} usersPlaces={this.state.usersPlaces} markers={markers} />

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
