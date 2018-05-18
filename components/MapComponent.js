


import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import firebase from 'firebase';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text } from 'native-base';
import MapCards from './MapCards';
import MapView from 'react-native-maps';

export default class MapComponent extends Component {

    state = {
        userLocation: null,
        usersPlaces: [],
        markets: [],
        mapCards: [],
        marketDistance: [],
        countOfPickups: this.props.countOfPickups,
      }

      componentWillMount() {
        let usersPosition = {};
        let countOfPickups = this.props.countOfPickups;
        
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

                // calls the google api to calculate distance between user's location 
                // and the geo markers (markets)
                let responseDistance = "";
                console.log('User location', this.props.userLocation);

                fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${this.props.userLocation.latitude},${this.props.userLocation.longitude}&destinations=${market.coords.lat},${market.coords.long}&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE`)
                  .then(res => res.json())
                  .then(parsedRes => {
                    responseDistance = parsedRes.rows[0].elements[0].distance.text;
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

                    this.setState({ mapCards: currentMapCards })
                  })
                  .catch(err => console.log(err));
              }
            })
          }
        })
      })
    }

  render() {
    return (
        <Header>

        </Header>
    );
  }
}