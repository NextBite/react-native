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

  componentWillMount() {
    // basically this.props.{name}, but navigator requires this
    const { params } = this.props.navigation.state;
    const marketName = params ? params.marketName : null;
    this.setState({marketName: marketName});

    let marketPickups = [];
    let currentMarketCards = [];
    let pickupObj = "";

    // query the pickup listings within a particular market
    let marketRef = firebase.database().ref(`markets/${marketName}`);
    marketRef.on('value', (snapshot) => {
      snapshot.forEach(function (child) {
        pickupObj = child.val();

        console.log("sdfkjsd", snapshot.child("-LCRYP9WHktOMrf_hp5A").val())

        // this ensures that the coords of the market aren't added to
        // the cards
        if(!(pickupObj.lat != null)) {
          marketPickups.push(pickupObj.listingId);
        }
      })

      this.setState({ pickups: marketPickups });

      // query for all pickup listing details
      let pickups = marketPickups.map((pickup) => {
        let listingsRef = firebase.database().ref(`listings/${pickup}`);
        listingsRef.on('value', (snapshot) => {
          let pickupsObj = {};
          snapshot.forEach(function (child) {
            pickupsObj[child.key] = child.val();
          });

          // check if any of the listings are expired
          // when a user visits a page that is when listings must be deleted
          // ***** no db func for this feature
          if(new Date(pickupsObj["expirationDate"]) <  new Date()) {
            console.log("expired");

            console.log("id?", pickupObj);
            //listingsRef.remove();
            //marketRef.child(pickupObj.toString()).remove();
          } else {
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
              listingId={pickup}
              key={pickup}
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
