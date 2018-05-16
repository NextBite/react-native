import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button } from 'native-base';
import firebase from 'firebase';

import FoodBankCards from './FoodBankCards';

export default class DropOffLocation extends React.Component {
  state = {};

  static navigationOptions = {
    title: 'Claim Pickup',
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;
    // includes name, lat, long separated by commas
    const location = params ? params.location : null;
    const listingId = params ? params.listingId : null;

    let marketLat = parseFloat(location.split(",")[1]);
    let marketLong = parseFloat(location.split(",")[2]);
    let foodBankInfo = []; // holds the name and distance of non-profit from current user's market
    let currentFoodBankCards = [];

    // fetch the non-profits
    fetch('https://raw.githubusercontent.com/lisakoss/NextBite/claim-donation/FoodBanks.json')
      .then(res => res.json())
      .then(parsedRes => {
        for (let key = 0; key < Object.keys(parsedRes).length; key++) {
          let responseDistance = "";
          fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${marketLat},${marketLong}&destinations=${parseFloat(parsedRes[key].latitude)},${parseFloat(parsedRes[key].longitude)}&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE`)
            .then(res => res.json())
            .then(parsedDistance => {
                currentFoodBankCards.push(
                  <FoodBankCards
                    title={parsedRes[key].name}
                    distance={parseFloat(parsedDistance.rows[0].elements[0].distance.text)}
                    coords={{ lat: parseFloat(parsedRes[key].latitude), long: parseFloat(parsedRes[key].longitude) }}
                    listingId={listingId}
                    key={parsedRes[key].name}
                    navigation={this.props.navigation}
                  />
                );


              if (key + 1 == Object.keys(parsedRes).length) {
                // sort the cards by smallest to largest according to distance away 
                // from the market the user picked
                currentFoodBankCards.sort(function (a, b) {
                  return parseFloat(a.props.distance) - parseFloat(b.props.distance);
                });


                let foodBankCardsShown = [];
                // show closest 5; abitrary number
                for (let i = 0; i < 5; i++) {
                  foodBankCardsShown.push(currentFoodBankCards[i]);
                }

                this.setState({ foodBankCards: foodBankCardsShown });
              }
            })
            .catch(err => console.log(err));
        } 
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.cards}>
          {this.state.foodBankCards}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  cards: {
    width: '100%',
    height: '100%',
  }
});
