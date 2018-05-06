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

    let marketLat = parseFloat(location.split(",")[1]);
    let marketLong = parseFloat(location.split(",")[2]);
    let foodBankInfo = []; // holds the name and distance of non-profit from current user's market

    // fetch the non-profits
    fetch('https://raw.githubusercontent.com/lisakoss/NextBite/claim-donation/FoodBanks.json')
      .then(res => res.json())
      .then(parsedRes => {
        console.log("parsedres", parsedRes);
        console.log(Object.keys(parsedRes));

        for (let key = 0; key < Object.keys(parsedRes).length; key++) {
          let responseDistance = "";
          fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${marketLat},${marketLong}&destinations=${parseFloat(parsedRes[key].latitude)},${parseFloat(parsedRes[key].longitude)}&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE`)
            .then(res => res.json())
            .then(parsedDistance => {
              foodBankInfo.push([parsedRes[key].name, parsedDistance.rows[0].elements[0].distance.text]);
              this.setState({ foodBankDistance: foodBankInfo });
              console.log("ds", foodBankInfo)

              if ((key + 1) == Object.keys(parsedRes).length) {
                let sortableDistance = this.state.foodBankDistance;

                sortableDistance.sort(function (a, b) {
                  return parseFloat(a[1].split(" ")[0]) - parseFloat(b[1].split(" ")[0]);
                });

                let currentFoodBankCards = [];

                // show closest 5; abitrary number
                for (let i = 0; i < 5; i++) {
                  currentFoodBankCards.push(
                    <FoodBankCards
                      title={sortableDistance[i][0]}
                      distance={sortableDistance[i][1]}
                      key={sortableDistance[i][0]}
                    />
                  );
                }
                this.setState({ foodBankCards: currentFoodBankCards });
              }
            })
            .catch(err => console.log(err));
        }
      })
      .then(() => {
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.cards}>
          {this.state.foodBankCards}
        </ScrollView>
        <View style={styles.button}>
          <Button transparent
            style={styles.innerButton}
            onPress={() => this.props.navigation.navigate('MarketList')}
          >
            <Text style={styles.buttonText}>Next</Text>
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
  },
  cards: {
    width: '100%',
    height: '100%',
  }
});
