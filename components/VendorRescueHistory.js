import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { Button } from 'native-base';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HeaderComponent from './HeaderComponent';
import HistoryCards from './HistoryCards';

export default class VendorRescueHistory extends React.Component {
  state = { title: 'Donation History' };

  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Donation History';
    let drawerIcon = () => (
      <Icon
        name="history"
        style={{ color: "#44beac", marginLeft: -3 }}
        size={28}
      />
    );
    return { drawerLabel, drawerIcon };
  }

  componentDidMount() {
    // query the pickup listings within a particular market
    let currUser = "FfevlFo2FSWs0MMHm7J65rHrMA52"; // CHANGE LATER TO NON-HARD CODE
    let rescuesRef = firebase.database().ref(`users/${currUser}/deliveredRescues`);

    let historyCards = [];
    let deliveredRescues = [];
    rescuesRef.on('value', (snapshot) => {
      snapshot.forEach(function (child) {
        console.log("DELIVERED RESCUES CHILD", child.val().listingId);
        deliveredRescues.push(child.val().listingId);
      });

      console.log("delivered rescues array", deliveredRescues);

      this.setState({ deliveredRescues: deliveredRescues });

      // query for all pickup listing details
      let rescues = deliveredRescues.map((rescue) => {
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

            historyCards.push(<HistoryCards
              boxes={pickupsObj.boxes}
              vendor={vendor}
              expiration={pickupsObj.expirationDate}
              weight={pickupsObj.weight}
              tags={pickupsObj.tags}
              market={pickupsObj.location}
              listingId={rescue}
              dropoffLocation={pickupsObj.dropoffLocation}
              key={rescue}
              navigation={this.props.navigation}
            />);

            historyCards.sort(function (a, b) {
              return new Date(a.props.expiration) - new Date(b.props.expiration);
            });

            this.setState({ historyCards: historyCards });
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
          {this.state.historyCards}
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
