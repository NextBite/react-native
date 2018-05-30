import React from 'react';
import { StyleSheet, Image, Alert, Linking, View, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Left, Body, Right } from 'native-base';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class VolunteerPendingCards extends React.Component {
  constructor(props) {
    super(props);

    this.openAlert = this.openAlert.bind(this);
    this.confirmDelivery = this.confirmDelivery.bind(this);
    this.openMaps = this.openMaps.bind(this);
  }

  openAlert() {
    Alert.alert(
      'Delivery Confirmation',
      `Has this rescue been successfully delivered to ${this.props.dropoffLocation.name}?`,
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

  openMaps() {
    const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=:';
    const latLng = `${this.props.dropoffLocation.lat},${this.props.dropoffLocation.long}`;
    const label = `${this.props.dropoffLocation.name}`;
    const url = Platform.OS === 'ios' ? `${scheme}${label}@${latLng}` : `${scheme}${latLng}(${label})`;

    Linking.openURL(url);
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
          <View style={styles.iconView}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Icon name='phone' style={styles.icons} onPress={() => Linking.openURL('tel:' + this.props.mobile)} />
              <Text style={styles.buttonText}>Contact</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Icon name='map-marker' style={styles.icons} onPress={() => this.openMaps()}/>
              <Text style={styles.buttonText}>Directions</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Icon name='check' style={styles.icons} onPress={() => this.openAlert()} />
              <Text style={styles.buttonText}>Deliver</Text>
            </View>
          </View>
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
  iconView: {
    flex: 1,
    flexDirection: 'row'
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
  topButton: {
    flex: 1,
    justifyContent: 'center'
  },
  card: {
    elevation: 0,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#247f6e'
  },
  footer: {
    backgroundColor: '#c1e0da',
    height: 70
  },
  icons: {
    fontSize: 30,
    color: '#247f6e',
  }
});

