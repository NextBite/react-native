import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button } from 'native-base';
import firebase from 'firebase';

import HeaderComponent from './HeaderComponent';

import FoodBankCards from './FoodBankCards';

export default class DropOffLocation extends React.Component {
  state = { title: "Choose Dropoff Location" };


  componentWillMount() {
    const { params } = this.props.navigation.state;
    // includes name, lat, long separated by commas
    const location = params ? params.location : null;
    const listingId = params ? params.listingId : null;
    const marketId = params ? params.marketId : null;
    const marketName = params ? params.marketName : null;

    let marketLat = parseFloat(location.split(",")[1]);
    let marketLong = parseFloat(location.split(",")[2]);
    let foodBankInfo = []; // holds the name and distance of non-profit from current user's market
    let currentFoodBankCards = [];

    // fetch the non-profits
    let nonprofitsRef = firebase.database().ref(`nonprofits`);
    nonprofitsRef.once("value").then(snapshot => {
      let nonprofitsArray = [];
      snapshot.forEach(function (child) {
        let nonprofit = {};
        //console.log("hours snapshot", snapshot.child("hours").val());
        console.log("child.val();", child.val());
        console.log("key", child.key)
        nonprofit["contents"] = child.val();
        nonprofit["key"] = child.key;
        console.log("nonprofit", nonprofit);
        nonprofitsArray.push(nonprofit);
      });

      console.log("nonprofits array", nonprofitsArray);
      console.log("params location", marketName);

      for (nonprofit of nonprofitsArray) {
        console.log("indi nonprofit", nonprofit);

        currentFoodBankCards.push(
          <FoodBankCards
            title={nonprofit.key}
            coords={{ lat: parseFloat(nonprofit.contents.coords.lat), long: parseFloat(nonprofit.contents.coords.long) }}
            distance={nonprofit.contents.distances[marketName]}
            listingId={listingId}
            marketId={marketId}
            marketName={marketName}
            key={nonprofit.key}
            navigation={this.props.navigation}
          />
        );

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

    });

    /*currentFoodBankCards.push(
      <FoodBankCards
        title={parsedRes[key].name}
        coords={{ lat: parseFloat(parsedRes[key].latitude), long: parseFloat(parsedRes[key].longitude) }}
        listingId={listingId}
        marketId={marketId}
        marketName={location}
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
    } */
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderComponent {...this.props} title={this.state.title} />
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
