import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'native-base';
import MapView from 'react-native-maps';
import firebase from 'firebase';

import FetchLocation from './FetchLocation';
import UsersMap from './UsersMap';
import MapCards from './MapCards';

export default class MarketMap extends React.Component {
  state = {
    userLocation: null,
    usersPlaces: [],
    markets: [],
    mapCards: [],
    marketDistance: [],
    countOfPickups: 0,
  }

  static navigationOptions = {
    title: 'Rescue Food',
  };

  componentDidMount() {
    let usersPosition = {};
    let countOfPickups = this.state.countOfPickups;
    
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
    let marketsArray = [];
    let marketsRef = firebase.database().ref('markets');
    marketsRef.on('value', (snapshot) => {


      snapshot.forEach(function (child) {
        let marketListing = {};
        
        marketListing["contents"] = child.val();
        marketListing["key"] = child.key;
        marketsArray.push(marketListing);
      });

      this.setState({ markets: marketsArray });

      marketsArray.map((market) => {
        let marketKeys = Object.keys(market.contents);

        console.log("Market Keys", marketKeys);

        // take all keys except "key", which is just the unique id of the db obj, and "coords", which are the coordinates
        for (let i = 0; i < marketKeys.length - 1; i++) {
          let marketListing = "";
          let marketListingsRef = firebase.database().ref(`markets/${market.key}/${marketKeys[i]}`);

          // not doing anything
          marketListingsRef.once('value')
          .then(snapshot => {
            // checks all posts to determine if expired
            if(new Date(snapshot.child("expirationDate").val()) <  new Date()) {
              marketListingsRef.remove();
            }

            // last two entires are the coords and keys, so skip over those to check
            // if ending has been reached yet
            if ((i + 2) == marketKeys.length) {
              let currentMapCards = this.state.mapCards;
              this.setState({ currentMarket: market.key })

              // calls the google api to calculate distance between user's location 
              // and the geo markers (markets)
              let responseDistance = "";
              fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${usersPosition.coords.latitude},${usersPosition.coords.longitude}&destinations=${market.contents.coords.lat},${market.contents.coords.long}&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE`)
                .then(res => res.json())
                .then(parsedRes => {
                  responseDistance = parsedRes.rows[0].elements[0].distance.text;
                })
                .then(() => {
                  console.log("keys", marketKeys);
                  console.log("length", marketKeys.length)
                  console.log("THE KEY", market.key);
                  currentMapCards.push(
                    <MapCards
                      title={market.key}
                      count={marketKeys.length - 1}
                      key={market.key}
                      distance={responseDistance}
                      navigation={this.props.navigation}
                    />
                  )

                  countOfPickups += (marketKeys.length - 1);
                  this.setState({countOfPickups: countOfPickups });

                  // sort the cards by smallest to largest according to distance away from user
                  currentMapCards.sort(function (a, b) {
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
    let markers = this.state.markets.slice(0, this.state.markets.length).map((market) => {
      let pos = { latitude: market.contents.coords.lat, longitude: market.contents.coords.long }

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
        <View style={styles.button}>
          <Button transparent
            style={styles.innerButton}
            onPress={() => this.props.navigation.navigate('MarketList', { marketCards: this.state.mapCards })}
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
