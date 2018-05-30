import React from 'react';
import { StyleSheet, Image, Alert, Linking } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import firebase from 'firebase';

export default class VolunteerPendingCards extends React.Component {
  constructor(props) {
    super(props);

    this.openAlert = this.openAlert.bind(this);
    this.confirmDelivery = this.confirmDelivery.bind(this);
  }

  openAlert() {
    Alert.alert(
      'Delivery Confirmation',
      `Has this this rescue been successfully delivered to ${this.props.dropoffLocation.name}?`,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes', onPress: () => this.confirmDelivery() },
      ],
      { cancelable: false }
    )
  }

  confirmDelivery() {
    console.log("update db");
    console.log("listingId", this.props.listingId);
    let listingId = this.props.listingId;

    // change delivered to yes
    firebase.database().ref().child(`listings/${listingId}`)
      .update({ delivered: "yes" });

    // remove from vendor's pending
    let vendorsRef = firebase.database().ref().child(`listings/${listingId}`);
    let vendorIdPromise = vendorsRef.once('value', (snapshot) => {
      return Promise.resolve(snapshot);
    });

    let listingKey = '';
    vendorIdPromise.then(function (value) {
      //let vendorId = value.child("userId").val();
      console.log("promise chain", value.child("userId").val())
      let vendorRescuesRef = firebase.database().ref(`users/${value.child("userId").val()}/pendingRescues`);
      vendorRescuesRef.on('value', (snapshot) => {
        snapshot.forEach(function (child) {
          if (child.val().listingId === listingId) {
            console.log("match", child.key)
            listingKey = child.key
          }
        });
      });

      let usersRef = firebase.database().ref(`users/${value.child("userId").val()}/deliveredRescues`);
      let newUserListing = {
        listingId: listingId,
      }
      console.log("pushing twice??????????", newUserListing);
      usersRef.push(newUserListing);

      console.log("Add to delivered")

      firebase.database().ref(`users/${value.child("userId").val()}/pendingRescues/${listingKey}`).remove();

      // remove from volunteer's pending
      let currUser = firebase.auth().currentUser.uid;
      let listingKey = '';
      let volunteerRescuesRef = firebase.database().ref(`users/${currUser}/claimedRescues`);
      volunteerRescuesRef.on('value', (snapshot) => {
        snapshot.forEach(function (child) {
          if (child.val().listingId === listingId) {
            console.log("match", child.key)
            listingKey = child.key;
          }
        });
      });

      let usersRef2 = firebase.database().ref(`users/${currUser}/deliveredRescues`);
      let newUserListing2 = {
        listingId: listingId,
      }
      usersRef2.push(newUserListing2);

      console.log("Add to delivered2")

      firebase.database().ref(`users/${currUser}/claimedRescues/${listingKey}`).remove();
    })
  }

  render() {
    return (
      <Card style={styles.card}>
        <CardItem>
          <Left>
            <Body>
              <Text>{this.props.vendor}</Text>
              <Text note style={styles.subText}>{String(new Date(this.props.expiration)).slice(0, -18)}</Text>
              <Text style={styles.regText}>
                This pickup has {this.props.boxes} boxes and weighs {this.props.weight}.
              </Text>
              <Text style={styles.regText}>
                Contains: {this.props.tags}
              </Text>
              <Text style={styles.regText}>
                This rescue is being delivered to {this.props.dropoffLocation.name}.
              </Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent
              style={styles.innerButton}
              onPress={() => Linking.openURL('tel:' + this.props.mobile)}
            >
              <Text style={styles.buttonText}>Contact {this.props.vendor}</Text>
            </Button>
            <Button transparent
              style={styles.innerButton}
              onPress={() => this.openAlert()}
            >
              <Text style={styles.buttonText}>Deliver</Text>
            </Button>
          </Left>
        </CardItem>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
    marginTop: 0
  },
  subText: {
    paddingBottom: 10,
  },
  regText: {
    fontSize: 14,
  },
  innerButton: {
    backgroundColor: '#44beac',
    alignSelf: 'center',
    alignItems: 'center',
    paddingRight: 0,
    marginLeft: 8
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
  },
});
