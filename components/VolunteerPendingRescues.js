import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { Button } from 'native-base';
import firebase from 'firebase';
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
import VolunteerPendingCards from './VolunteerPendingCards';

export default class VolunteerPendingRescues extends React.Component {
  state = {title:"Pending Rescues"};

  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Pending Rescues';
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
    // query the pickup listings within a particular market
    let currUser = firebase.auth().currentUser.uid;
    let rescuesRef = firebase.database().ref(`users/${currUser}/claimedRescues`);

    let pendingCards = [];
    let claimedRescues = [];
    rescuesRef.on('value', (snapshot) => {
      snapshot.forEach(function (child) {
        claimedRescues.push(child.val().listingId);
      });

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
              dropoffLocation={pickupsObj.dropoffLocation}
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
      <View>
      <HeaderComponent {...this.props} title={this.state.title} />
      <ScrollView style={styles.cards}>
        {this.state.pendingCards}
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
