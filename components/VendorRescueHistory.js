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

            historyCards.push(<HistoryCards
              boxes={pickupsObj.boxes}
              vendor={volunteerName}
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
