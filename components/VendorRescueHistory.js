import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { Button } from 'native-base';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HeaderComponent from './HeaderComponent';
import HistoryCardsVendor from './HistoryCardsVendor';

export default class VendorRescueHistory extends React.Component {
  state = {
    title: 'Donation History'
  };

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
    let currUser = firebase.auth().currentUser.uid;
    let rescuesRef = firebase.database().ref(`users/${currUser}/deliveredRescues`);

    rescuesRef.on('value', (snapshot) => {
      let historyCards = [];
      let deliveredRescues = [];
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

          let usersRef = firebase.database().ref(`users/${pickupsObj.claimedBy}`);
          usersRef.once('value', (snapshot) => {
            let volunteerName = `${snapshot.child("firstName").val()} ${snapshot.child("lastName").val()}`;

            historyCards.push(<HistoryCardsVendor
              timestamp={new Date(pickupsObj.time)}
              location={pickupsObj.location}
              boxes={pickupsObj.boxes}
              weight={pickupsObj.weight}
              tag={pickupsObj.tags}
              expiration={pickupsObj.expirationDate}
              volunteer={volunteerName}
              dropoff={pickupsObj.dropoffLocation.name}
              listingID={pickupsObj.listingId}
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
    let content;
    if (this.state.historyCards !== undefined) {
      content = (
        <ScrollView style={styles.cards}>
          {this.state.historyCards}
        </ScrollView>
      );
    } else (
      content = (
        <Text style={styles.text}>No Donation History</Text>
      )
    )
    return (
      <View style={styles.view}>
        <HeaderComponent {...this.props} title={this.state.title} />
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cards: {
    width: '100%',
    height: '100%',
    backgroundColor: '#44beac'
  },
  text: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 50
  },
  view: {
    marginBottom: 50,
  },
});
