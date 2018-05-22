import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { Button } from 'native-base';
import firebase from 'firebase';

import VendorPendingCards from './VendorPendingCards';

export default class VendorPendingRescues extends React.Component {
  state = {};

  static navigationOptions = {
    title: 'Pending Rescues',
  };

  componentDidMount() {
    // query the pickup listings within a particular market
    let currUser = "FfevlFo2FSWs0MMHm7J65rHrMA52"; // CHANGE LATER TO NON-HARD CODE
    let rescuesRef = firebase.database().ref(`users/${currUser}/pendingRescues`);

    let pendingCards = [];
    let pendingRescues = [];
    rescuesRef.on('value', (snapshot) => {
      snapshot.forEach(function (child) {
        console.log("PENDING RESCUES CHILD", child.val().listingId);
        pendingRescues.push(child.val().listingId);
      });

      console.log("pending rescues array", pendingRescues);

      this.setState({ pendingRescues: pendingRescues });

      // query for all pickup listing details
      let rescues = pendingRescues.map((rescue) => {
        let listingsRef = firebase.database().ref(`listings/${rescue}`);
        listingsRef.on('value', (snapshot) => {
          let pickupsObj = {};
          snapshot.forEach(function (child) {
            pickupsObj[child.key] = child.val();
          });

          pickupsObj["listingId"] = rescue;

          let vendorRef = firebase.database().ref(`users/${pickupsObj.userId}`);
          vendorRef.once('value', (snapshot) => {
            let vendor = snapshot.child("vendorName").val();

            let volunteerRef = firebase.database().ref(`users/${pickupsObj.claimedBy}`);
            volunteerRef.once('value', (snapshot) => {
              let volunteerName = `${snapshot.child("firstName").val()} ${snapshot.child("lastName").val()}`;

              pendingCards.push(<VendorPendingCards
                boxes={pickupsObj.boxes}
                vendor={vendor}
                expiration={pickupsObj.expirationDate}
                weight={pickupsObj.weight}
                tags={pickupsObj.tags}
                market={pickupsObj.location}
                listingId={rescue}
                dropoffLocation={pickupsObj.dropoffLocation}
                volunteer={volunteerName}
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