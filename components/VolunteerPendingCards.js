import React from 'react';
import { StyleSheet, Image, Alert, Linking, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Left, Body, Right } from 'native-base';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

    vendorIdPromise.then(function (value) {
      //let vendorId = value.child("userId").val();
      console.log("promise chain", value.child("userId").val())
      let vendorRescuesRef = firebase.database().ref(`users/${value.child("userId").val()}/pendingRescues`);
      vendorRescuesRef.once('value', (snapshot) => {
        snapshot.forEach(function (child) {
          console.log("reallisting", listingId);
          console.log("the child val listing", child.val().listingId);
          if (child.val().listingId === listingId) {
            console.log("match", child.key)
            firebase.database().ref(`users/${value.child("userId").val()}/pendingRescues/${child.key}`).remove();
          }
        });
      });

      let usersRef = firebase.database().ref(`users/${value.child("userId").val()}/deliveredRescues`);
      let newUserListing = {
        listingId: listingId,
      }
      console.log("pushing twice??????????", newUserListing);
      usersRef.push(newUserListing);


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

  buttonOptions() {
    if(this.props.pickedUp === "yes") {
      return (
        <View style={styles.cardView}>
          <Left style={styles.leftButton}>
            <Button transparent
              onPress={() => Linking.openURL('tel:' + this.props.mobile)}
            >
              <Text style={styles.buttonText}> Contact</Text>
            </Button>
          </Left>
          <Right style={styles.rightButton}>
            <Button transparent
              onPress={() => this.openAlert()}
            >
              <Text style={styles.buttonText}>Deliver</Text>
            </Button>
          </Right>
        </View>
      );
    } else {
      return (
        <View style={styles.cardView}>
          <Left style={styles.leftButton}>
            <Button transparent
              onPress={() => Linking.openURL('tel:' + this.props.mobile)}
            >
              <Text style={styles.buttonText}> Contact</Text>
            </Button>
          </Left>
        </View>
      );
    }
  }

  render() {
    let vendorName = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Vendor</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.vendor}</Text>
        </Right>
      </View>
    );

    let location = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Pickup Location</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.market}</Text>
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
          <Text style={styles.rightText}>{this.props.tags}</Text>
        </Right>
      </View>
    );

    let expiration = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Expiration Time</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{String(new Date(this.props.expiration)).slice(0, -18)}</Text>
        </Right>
      </View>
    );

    let dropoffLocation = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Dropoff Location</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.dropoffLocation.name}</Text>
        </Right>
      </View>
    );

    let deliveryStatus;
    if(this.props.pickedUp === "yes") {
      deliveryStatus = (
        <View style={styles.cardView}>
          <Left style={styles.left}>
            <Text style={styles.leftText}>Delivery Status</Text>
          </Left>
          <Right style={styles.right}>
            <Text style={styles.rightText}>Picked up</Text>
          </Right>
        </View>
      );
    } else {
      deliveryStatus = (
        <View style={styles.cardView}>
          <Left style={styles.left}>
            <Text style={styles.leftText}>Delivery Status</Text>
          </Left>
          <Right style={styles.right}>
            <Text style={styles.rightText}>Not picked up</Text>
          </Right>
        </View>
      );
    }
    
    return (
      <Card style={styles.card}>
        <CardItem>
          <Body>
            {vendorName}
            {location}
            {boxes}
            {weight}
            {tags}
            {expiration}
            {dropoffLocation}
            {deliveryStatus}
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

