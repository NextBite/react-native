import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import MapView from 'react-native-maps';
import firebase from 'firebase';

import { Icon } from 'native-base';
import FetchLocation from './FetchLocation';
import UsersMap from './UsersMap';
import MapCards from './MapCards';
import HeaderComponent from './HeaderComponent';

export default class MarketList extends React.Component {
  state = {
    userLocation: null,
    usersPlaces: [],
    markets: [],
    mapCards: [],
    marketDistance: [],
    countOfPickups: 0,
  }

  componentWillMount() {
    let usersPosition = {};
    let countOfPickups = this.state.countOfPickups;
    // get user's current location on load of map
    navigator.geolocation.getCurrentPosition(position => {
      console.log("possssss MARKETLIST", position);
      //if (position.coords.latitude !== undefined) {
      console.log("pos MARKETLIST", position);
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

    }).then(() => {


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
                //this.setState({ currentMarket: market.key })
  
                // calls the google api to calculate distance between user's location 
                // and the geo markers (markets)
                let responseDistance = "";

                let posUser = {};
                navigator.geolocation.getCurrentPosition(position => {
                  console.log("NEW POS1", position);
                  //if (position.coords.latitude !== undefined) {
                  console.log("new POS", position);
                  posUser = position;
                  this.setState({
                    userLocation: {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                      latitudeDelta: 0.0622,
                      longitudeDelta: 0.0421,
                    }
                  });
            
                }).then(() => {

                
  
                console.log("THE STATE", usersPosition.latitude);
                console.log("THE STATE LONG", usersPosition.longitude);

                console.log("posUser", this.state.userLocation);
  
                fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${this.state.userLocation.latitude},${this.state.userLocation.longitude}&destinations=${market.coords.lat},${market.coords.long}&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE`)
                  .then(res => res.json())
                  .then(parsedRes => {

     
                    responseDistance = parsedRes.rows[0].elements[0].distance.text;
                    console.log("APRSED RTED", parsedRes)
                    console.log("RESPONSEDISTANCE!!!!", responseDistance);
                  })
                  .then(() => {
                    console.log("NEW RESP DIS", responseDistance)
                    currentMapCards.push(
                      <MapCards
                        title={market.key}
                        count={marketKeys.length - 2}
                        key={market.key}
                        distance={responseDistance}
                        navigation={this.props.navigation}
                      />
                    )
  
                    countOfPickups += (marketKeys.length - 2);
                    this.setState({ countOfPickups: countOfPickups });
  
                    // sort the cards by smallest to largest according to distance away from user
                    currentMapCards.sort(function (a, b) {
                      return parseFloat(a.props.distance) - parseFloat(b.props.distance);
                    });
  
                    //this.setState({ mapCards: currentMapCards })
                  })
                  .catch(err => console.log(err));
                })
              }
              
            })
            
          }
        })
      })





    });

  } //end of component willmount






  render() {




    return (
      <View>
        <HeaderComponent {...this.props} title={this.state.title} />
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
