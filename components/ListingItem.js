'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Text, Linking, Alert } from 'react-native';
import { Container, Content, Card, CardItem, Body, Button, Left, Right } from 'native-base';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class ListingItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.deleteListing = this.deleteListing.bind(this);
    this.alertDelete = this.alertDelete.bind(this);
    this.openPickupAlert = this.openPickupAlert.bind(this);
    this.confirmPickup = this.confirmPickup.bind(this);
  }

  openPickupAlert(listingId) {
    Alert.alert(
      'Pickup Confirmation',
      `Has the volunteer picked up this donation?`,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes', onPress: () => this.confirmPickup() },
      ],
      { cancelable: false }
    )
  }

  confirmPickup() {
    let currUser = firebase.auth().currentUser.uid;
    firebase.database().ref().child(`listings/${this.props.listingID}`)
      .update({ pickedUp: "yes" });

    firebase.database().ref().child(`users/${currUser}/pendingRescues/${this.props.pendingRescueKey}`)
      .update({ pickedUp: "yes" });
  }

  checkStatus() {
    if (this.props.claimed === 'no') {
      return (<Text style={styles.rightText}>Waiting to be claimed</Text>)
    } else if (this.props.claimed === 'yes') {
      return (
        <View>
          <Text style={styles.rightText}>Claimed by {this.props.volunteer}</Text>
        </View>
      );
    }
  }

  deliveryStatus() {
    if (this.props.claimed === 'no') {
      return null
    } else if (this.props.claimed === 'yes') {
      if (this.props.delivered === 'no' && this.props.pickedUp === 'no') {
        return (
          <View style={styles.cardView} >
            <Left style={styles.left}>
              <Text style={styles.leftText}>Delivery Status</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.rightText}>Not picked up</Text>
            </Right>
          </View>
        );
      } else if (this.props.delivered === 'no' && this.props.pickedUp === 'yes') {
        return (
          <View style={styles.cardView} >
            <Left style={styles.left}>
              <Text style={styles.leftText}>Delivery Status</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.rightText}>Picked up, but not yet delivered</Text>
            </Right>
          </View>
        );
      } else if (this.props.delivered === 'yes') {
        return (
          <View style={styles.cardView} >
            <Left style={styles.left}>
              <Text style={styles.leftText}>Delivery Status</Text>
            </Left>
            <Right style={styles.right}>
              <Text style={styles.rightText}>Delivered!</Text>
            </Right>
          </View>
        );
      }
    }
  }

  dropoffLocationStatus() {
    if (this.props.claimed === 'no') {
      return null
    } else if (this.props.claimed === 'yes') {
      return (
        <View style={styles.cardView}>
          <Left style={styles.left}>
            <Text style={styles.leftText}>Dropoff Location</Text>
          </Left>
          <Right style={styles.right}>
            <Text style={styles.rightText}>{this.props.dropoff.name}</Text>
          </Right>
        </View>
      );
    }
  }

  buttonOptions() {
    if (this.props.claimed === 'no' && this.props.pickedUp === 'no') {
      return (
        <View style={styles.cardView}>
          <Left style={styles.leftButton}>
            <Button transparent
              onPress={() => this.props.navigation.navigate('EditRescue', { location: this.props.location.split(",")[0], boxes: this.props.boxes, weight: this.props.weight, tags: this.props.tag, expiration: this.props.expiration, listingId: this.props.listingId })}>
              <Text style={styles.buttonText}>EDIT</Text>
            </Button>
          </Left>
          <Right style={styles.rightButton}>
            <Button transparent
              onPress={() => this.alertDelete()}
            >
              <Text style={styles.buttonText}>DELETE</Text>
            </Button>
          </Right>
        </View>
      );
    } else if (this.props.claimed === 'yes' && this.props.pickedUp === "no") {
      let volunteer = this.props.volunteer.toUpperCase();
      console.log("pending rescue key", this.props.pendingRescueKey);
      return (
        <View style={styles.cardView}>
          <Left style={styles.leftButton}>
            <Button transparent
              style={{ alignSelf: 'center' }}
              onPress={() => Linking.openURL('tel:' + this.props.mobile)}>
              <Text style={styles.buttonText}> CONTACT</Text>
            </Button>
          </Left>
          <Right style={styles.rightButton}>
            <Button transparent
              onPress={() => this.openPickupAlert()}
            >
              <Text style={styles.buttonText}>CONFIRM</Text>
            </Button>
          </Right>
        </View>
      );
    } else if (this.props.claimed === 'yes' && this.props.pickedUp === 'yes') {
      let volunteer = this.props.volunteer.toUpperCase();
      return (
        <View style={styles.cardViewAlt}>
          <Button transparent
            style={{ alignSelf: 'center' }}
            onPress={() => Linking.openURL('tel:' + this.props.mobile)}>
            <Text style={styles.buttonText}> CONTACT</Text>
          </Button>
        </View>
      );
    }
  }

  alertDelete() {
    Alert.alert(
      'Delete Donation Listing?',
      `Are you sure you want to delete this donation listing?`,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Okay', onPress: () => this.deleteListing() },
      ],
      { cancelable: false }
    )
  }

  deleteListing() {
    let listingId = this.props.listingID
    let user = firebase.auth().currentUser;
    let randomKey = this.props.pendingRescueKey
    let currentMarket = this.props.location.split(",")[0];

    return new Promise(function (resolve, reject) {
      let pendingRescueRef = firebase.database().ref(`users/${user.uid}/pendingRescues/${randomKey}`);
      resolve(pendingRescueRef.remove());
    }).then(() => {
      return new Promise(function (resolve, reject) {
        let userListingRef = firebase.database().ref(`users/${user.uid}/listings`);
        console.log('delete func user listing ref')
        userListingRef.once('value', (snapshot) => {
          console.log('delete func user listing ref once()')
          snapshot.forEach(function (child) {
            if (child.val().listingId === listingId) {
              let newRef = firebase.database().ref(`users/${user.uid}/listings/${child.key}`)
              resolve(newRef.remove());
              //console.log("remove from user's listing")
            }
          })
        });
      })
    }).then(() => {
      return new Promise(function (resolve, reject) {
        let marketRef = firebase.database().ref(`markets/${currentMarket}`)
        marketRef.once('value', (snapshot) => {
          console.log('remove from market listing')
          snapshot.forEach(function (child) {
            if (child.val().listingId === listingId) {
              let newRef = firebase.database().ref(`markets/${currentMarket}/${child.key}`)
              resolve(newRef.remove());
            }
          })
        });

      })
    }).then(() => {
      return new Promise(function (resolve, reject) {
        let listingRef = firebase.database().ref(`listings/${listingId}`);
        console.log('delete func listing ref')
        resolve(listingRef.remove());
      })
    })
  }

  readableTime(time) {
    let dt = time.toString().slice(0, -18).split(" ");
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
    let timestamp = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Created at</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.readableTime(this.props.timestamp)}</Text>
        </Right>
      </View>
    );

    let location = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Pickup Location</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.location.split(",")[0]}</Text>
        </Right>
      </View>
    );

    let boxes = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Number of Boxes</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.boxes}</Text>
        </Right>
      </View>
    );

    let weight = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Approx. weight</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.weight}</Text>
        </Right>
      </View>
    );

    let tags = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Types of Food</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.tag}</Text>
        </Right>
      </View>
    );

    let expiration = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Expiration Time</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.readableTime(this.props.expiration)}</Text>
        </Right>
      </View>
    );

    let status = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Donation Status</Text>
        </Left>
        <Right style={styles.right}>
          {this.checkStatus()}
        </Right>
      </View>
    );

    return (
      <Card style={styles.card}>
        <CardItem>
          <Body>
            {timestamp}
            {location}
            {boxes}
            {weight}
            {tags}
            {expiration}
            {status}
            {this.deliveryStatus()}
            {this.dropoffLocationStatus()}
          </Body>
        </CardItem>
        <CardItem footer bordered style={styles.footer}>
          {this.buttonOptions()}
        </CardItem>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  cardView: {
    flex: 1,
    flexDirection: 'row'
  },
  cardViewAlt: {
    flex: 1,
  },
  left: {
    flex: 4,
  },
  right: {
    flex: 6,
    alignItems: 'flex-start',
    borderLeftWidth: 2,
    borderLeftColor: '#44beac'
  },
  leftText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
    color: '#247f6e'
  },
  rightText: {
    marginLeft: 10,
    fontSize: 15,
    marginBottom: 10
  },
  leftButton: {
    flex: 1,
    justifyContent: 'center',
  },
  rightButton: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#247f6e'
  },
  footer: {
    backgroundColor: '#c1e0da'
  }
});