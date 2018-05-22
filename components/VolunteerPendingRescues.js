import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { Button } from 'native-base';
import firebase from 'firebase';

import VolunteerPendingCards from './VolunteerPendingCards';

export default class VolunteerPendingRescues extends React.Component {
  state = {};

  static navigationOptions = {
    title: 'Pending Rescues',
  };

  componentDidMount() {
    // query the pickup listings within a particular market
    let currUser = "lGtcBwxX1XWtdioXbuEmQQUuTVn1"; // CHANGE LATER TO NON-HARD CODE
    let rescuesRef = firebase.database().ref(`users/${currUser}/claimedRescues`);

    let pendingCards = [];
    let claimedRescues = [];
    rescuesRef.on('value', (snapshot) => {
      snapshot.forEach(function (child) {
        console.log("PENDING RESCUES CHILD", child.val().listingId);
        claimedRescues.push(child.val().listingId);
      });

      console.log("claimed rescues array", claimedRescues);

      this.setState({ claimedRescues: claimedRescues });

      // query for all pickup listing details
      let rescues = claimedRescues.map((rescue) => {
        let listingsRef = firebase.database().ref(`listings/${rescue}`);
        listingsRef.on('value', (snapshot) => {
          let pickupsObj = {};
          snapshot.forEach(function (child) {
            pickupsObj[child.key] = child.val();
          });

          pickupsObj["listingId"] = rescue;

          let usersRef = firebase.database().ref(`users/${pickupsObj.userId}`);
          usersRef.on('value', (snapshot) => {
            let vendor = "";
            snapshot.forEach(function (child) {
              if (child.key == "vendorName") {
                vendor = child.val();
              }
            });

            pendingCards.push(<VolunteerPendingCards
              boxes={pickupsObj.boxes}
              vendor={vendor}
              expiration={pickupsObj.expirationDate}
              weight={pickupsObj.weight}
              tags={pickupsObj.tags}
              market={pickupsObj.location}
              listingId={rescue}
              key={rescue}
              navigation={this.props.navigation}
            />);

            pendingCards.sort(function (a, b) {
              return new Date(a.props.expiration) - new Date(b.props.expiration);
            });

            this.setState({ pendingCards: pendingCards });
          });
        });
      });
    });
  }

  render() {
    return (
      <ScrollView style={styles.cards}>
        {this.state.pendingCards}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cards: {
    width: '100%',
    height: '100%',
  }
});
