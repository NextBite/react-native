import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button } from 'native-base';
import firebase from 'firebase';
import Sugar from 'sugar-date';

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

        console.log("nonprofit hrs", nonprofit.contents.hours);
        console.log("get today's day", new Date().getDay())

        let day;
        switch (new Date().getDay()) {
          case 0:
            day = "Sunday";
            break;
          case 1:
            day = "Monday";
            break;
          case 2:
            day = "Tuesday";
            break;
          case 3:
            day = "Wednesday";
            break;
          case 4:
            day = "Thursday";
            break;
          case 5:
            day = "Friday";
            break;
          case 6:
            day = "Saturday";
        }

        console.log("nonprofit hrs with day", nonprofit.contents.hours[day])
        console.log("hrs @ open", Sugar.Date.create(nonprofit.contents.hours[day].split("-")[0]));
        console.log("hrs @ close", Sugar.Date.create(nonprofit.contents.hours[day].split("-")[1]));
        console.log("my curr date", new Date());

        console.log("together", day + " " + nonprofit.contents.hours[day].split("-")[0]);

        let openTime = Sugar.Date.create(nonprofit.contents.hours[day].split("-")[0]);
        let closeTime = Sugar.Date.create(nonprofit.contents.hours[day].split("-")[1]);
        let currentTime = new Date();
        // opening time is after current time or closing time is before current time
        // don't add
        if(openTime > currentTime || closeTime < currentTime) {

          console.log("bank closed", nonprofit)
        } else { // nonprofit is open, add card
          console.log("bank open", nonprofit)
          currentFoodBankCards.push(
            <FoodBankCards
              title={nonprofit.key}
              coords={{ lat: parseFloat(nonprofit.contents.coords.lat), long: parseFloat(nonprofit.contents.coords.long) }}
              distance={nonprofit.contents.distances[marketName]}
              openTime={nonprofit.contents.hours[day].split("-")[0]}
              closeTime={nonprofit.contents.hours[day].split("-")[1]}
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
        }

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
