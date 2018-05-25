'use strict';

import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

import HeaderComponent from './HeaderComponent';
import ListingItem from './ListingItem';

export default class PendingDonations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donationCards: [],
      title: "Pending Donations"
    };
    this.readableTime = this.readableTime.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Pending Donations';
    let drawerIcon = () => (
      <Svg height="28" width="28">
        <Polygon fill="#44BEAC" points="16.3,0 16.3,4.7 14,3.5 11.7,4.7 11.7,0 7.6,0 7.6,12.8 20.4,12.8 20.4,0 " />
        <Polygon fill="#44BEAC" points="8.8,15.2 8.8,19.8 6.4,18.7 4.1,19.8 4.1,15.2 0,15.2 0,28 12.8,28 12.8,15.2 " />
        <Polygon fill="#44BEAC" points="23.9,15.2 23.9,19.8 21.6,18.7 19.2,19.8 19.2,15.2 15.2,15.2 15.2,28 28,28 28,15.2 " />
      </Svg>
    );
    return { drawerLabel, drawerIcon };
  }

  componentDidMount() {
    let userListings = [];
    let currentDonationCards = [];

    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user uid", user.uid)
        // query for vendor's listingIds
        let listingRef = firebase.database().ref(`users/${user.uid}/pendingRescues`);
        listingRef.on('value', (snapshot) => {
          snapshot.forEach(function (child) {
            console.log("child", child.val())
            let listingObj = child.val();
            userListings.push(listingObj.listingId)
          });
          //this.setState({ userListingsId: userListings })
          console.log("user listings", userListings)

          //query for details of each listing
          let listings = userListings.map((listingId) => {
            console.log("listingId", listingId)
            let volunteerName = ""
            let listingDetailRef = firebase.database().ref(`listings/${listingId}`);
            listingDetailRef.on('value', (snapshot) => {
              let listingDetailObj = {};
              snapshot.forEach(function (child) {
                listingDetailObj[child.key] = child.val()
                console.log("listing id child", child.val())
                console.log("child key", child.key)
              });

              listingDetailObj["listingId"] = listingId;
              console.log("claimed by", listingDetailObj.claimedBy)
              // retrieve volunteer's name for the listing
              let usersRef = firebase.database().ref(`users/${listingDetailObj.claimedBy}`);
              usersRef.once('value', (snapshot) => {
                volunteerName = `${snapshot.child("firstName").val()} ${snapshot.child("lastName").val()}`;
                console.log("ahahah", volunteerName)

                currentDonationCards.push(<ListingItem
                  timestamp={this.readableTime(new Date(listingDetailObj.time))}
                  location={listingDetailObj.location.split(",")[0]}
                  boxes={listingDetailObj.boxes}
                  weight={listingDetailObj.weight}
                  tag={listingDetailObj.tags}
                  expiration={this.readableTime(listingDetailObj.expirationDate)}
                  claimed={listingDetailObj.claimed}
                  volunteer={volunteerName}
                  delivered={listingDetailObj.delivered}
                  dropoff={listingDetailObj.dropoffLocation}
                />);

                currentDonationCards.sort(function (a, b) {
                  return new Date(a.props.expiration) - new Date(b.props.expiration);
                });
                this.setState({ donationCards: currentDonationCards })
              });
            });
          });
        });
      } else {
        this.setState({ userId: null })
      }
    });
  }

  componentWillUnmount() {
    if (this.unregister) {
      this.unregister();
    }
  }

  readableTime(time) {
    let dt = time.toString().slice(0, -18).split(" ");
    console.debug(dt);
    let hour = dt[4].split(":")[0];
    if (parseInt(hour) > 0 && parseInt(hour) < 12) {
      dt[4] = dt[4] + " AM";
    } else if (parseInt(hour) > 12) {
      dt[4] = (parseInt(hour) - 12).toString() + ":" + dt[4].split(":")[1] + " PM";
    } else if (parseInt(hour) === 12) {
      dt[4] = dt[4] + " PM";
    } else if (parseInt(hour) === 0) {
      dt[4] = "12:" + dt[4].split(":")[1] + " AM";
    }
    return dt[0] + " " + dt[1] + " " + dt[2] + " " + dt[3] + ", " + dt[4];
  }

  render() {
    return (
      <View style={styles.view}>
        <HeaderComponent {...this.props} title={this.state.title} />
        <ScrollView style={styles.cards}>
          {this.state.donationCards}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cards: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
  view: {
    marginBottom: 70,
  },
});