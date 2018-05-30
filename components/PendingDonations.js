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

      title: "Pending Donations"
    };
  }

  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Pending Donations';
    let drawerIcon = () => (
      <Svg height="24" width="24">
        <Polygon fill="#44BEAC" points="14,0 14,4 12,3 10,4 10,0 6.5,0 6.5,11 17.5,11 17.5,0 " />
        <Polygon fill="#44BEAC" points="7.5,13 7.5,17 5.5,16 3.5,17 3.5,13 0,13 0,24 11,24 11,13 " />
        <Polygon fill="#44BEAC" points="20.5,13 20.5,17 18.5,16 16.5,17 16.5,13 13,13 13,24 24,24 24,13 " />
      </Svg>
    );
    return { drawerLabel, drawerIcon };
  }

  componentDidMount() {

    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // query for vendor's listingIds
        let pendingRescueRef = firebase.database().ref(`users/${user.uid}/pendingRescues`);

        pendingRescueRef.on('value', (snapshot) => {
          let currentDonationCards = [];
          let userListings = [];
          this.setState({ donationCards: [] });

          snapshot.forEach(function (child) {
            let pendingRescueObj = {}
            pendingRescueObj['randomKey'] = child.key;
            pendingRescueObj['listingId'] = child.val().listingId;
            userListings.push(pendingRescueObj);
          });

          //query for details of each listing
          let listings = userListings.map((obj) => {
            let listingDetailRef = firebase.database().ref(`listings/${obj.listingId}`);
            listingDetailRef.once('value', (snapshot) => {
              let listingDetailObj = {};
              snapshot.forEach(function (child) {
                listingDetailObj[child.key] = child.val()
              });
              listingDetailObj["listingId"] = obj.listingId;

              // retrieve volunteer's name for the listing
              let volunteerName = ""
              let usersRef = firebase.database().ref(`users/${listingDetailObj.claimedBy}`);
              usersRef.once('value', (snapshot) => {
                volunteerMobile = snapshot.child("mobile").val();
                let volunteerName = `${snapshot.child("firstName").val()} ${snapshot.child("lastName").val()}`;

                currentDonationCards.push(<ListingItem
                  timestamp={new Date(listingDetailObj.time)}
                  location={listingDetailObj.location}
                  boxes={listingDetailObj.boxes}
                  weight={listingDetailObj.weight}
                  tag={listingDetailObj.tags}
                  expiration={listingDetailObj.expirationDate}
                  claimed={listingDetailObj.claimed}
                  volunteer={volunteerName}
                  mobile={volunteerMobile}
                  delivered={listingDetailObj.delivered}
                  dropoff={listingDetailObj.dropoffLocation}
                  listingID={listingDetailObj.listingId}
                  navigation={this.props.navigation}
                  pendingRescueKey={obj.randomKey}
                />)

                // currentDonationCards.push(oneCard)
                currentDonationCards.sort(function (a, b) {
                  return new Date(a.props.expiration) - new Date(b.props.expiration);
                });


                this.setState({ donationCards: currentDonationCards });
              });
            });
          });
        });
      } else {
        this.setState({ userId: null });
      }
    });
  }

  componentWillUnmount() {
    if (this.unregister) {
      this.unregister();
    }
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
    marginBottom: 56,
  },
});
