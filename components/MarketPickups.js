import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import firebase from 'firebase';

import MarketCards from './MarketCards';
import MarketTitleCard from './MarketTitleCard'

export default class MarketPickups extends React.Component {
  state = {};

  static navigationOptions = {
    title: 'Market Details',
  };

  componentDidMount() {
    // basically this.props.{name}, but navigator requires this
    const { params } = this.props.navigation.state;
    const marketName = params ? params.marketName : null;
    const marketKey = params ? params.marketKey : null;
    this.setState({ marketName: marketName });

    // query the pickup listings within a particular market
    let marketRef = firebase.database().ref(`markets/${marketName}`);
    marketRef.on('value', (snapshot) => {
      let marketPickups = [];
      let marketIds = [];
      let currentMarketCards = [];
      let pickupObj = "";
      snapshot.forEach(function (child) {
        pickupObj = child.val();

        // this ensures that the coords of the market aren't added to
        // the cards
        if (child.key !== "coords") {
          marketPickups.push(pickupObj.listingId);
          marketIds.push({ dbKey: child.key, listingId: pickupObj.listingId });
        }
      });

      this.setState({ pickups: marketPickups });

      // query for all pickup listing details
      let pickups = marketIds.map((pickup) => {
        let listingsRef = firebase.database().ref(`listings/${pickup["listingId"]}`);
        listingsRef.on('value', (snapshot) => {
          let pickupsObj = {};
          snapshot.forEach(function (child) {
            pickupsObj[child.key] = child.val();
          });

          pickupsObj["listingId"] = pickup["listingId"];

          if (new Date(pickupsObj["expirationDate"]) > new Date() /*&& pickupsObj["claimed"] === "no"*/) {
            // retrieve vendor's name for the listing
            let usersRef = firebase.database().ref(`users/${pickupsObj.userId}`);
            usersRef.on('value', (snapshot) => {
              let vendor = "";
              snapshot.forEach(function (child) {
                if (child.key == "vendorName") {
                  vendor = child.val();
                }
              });

              currentMarketCards.push(<MarketCards
                boxes={pickupsObj.boxes}
                vendor={vendor}
                expiration={pickupsObj.expirationDate}
                weight={pickupsObj.weight}
                tags={pickupsObj.tags}
                marketId={pickup["dbKey"]}
                listingId={pickup["listingId"]}
                key={pickup["listingId"]}
                navigation={this.props.navigation}
              />);

              currentMarketCards.sort(function (a, b) {
                return new Date(a.props.expiration) - new Date(b.props.expiration);
              });

              this.setState({ marketCards: currentMarketCards });
            });
          }
        });
      });
    });
  }

  render() {
    return (
      <View>
        <ScrollView style={styles.cards}>
          <MarketTitleCard
            marketName={this.state.marketName}
          />
          {this.state.marketCards}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cards: {
    width: '100%',
    height: '100%',
  }
});
