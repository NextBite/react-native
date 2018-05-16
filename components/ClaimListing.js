import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'native-base';
import firebase from 'firebase';

import MarketCards from './MarketCards';

export default class MarketPickups extends React.Component {
  state = {};

  /*static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    
    return {
      title: params ? params.listingId : 'A Nested Details Screen',
    }
  };*/

  static navigationOptions = {
    title: 'Claim Pickup',
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const listingId = params ? params.listingId : null;

    this.setState({ listingId: listingId })

    // get information on the listing the volunteer is wanting to claim
    let listingRef = firebase.database().ref(`listings/${listingId}`);
    listingRef.once("value").then(snapshot => {
      this.setState({ boxes: snapshot.child("boxes").val() });
      this.setState({ expirationDate: snapshot.child("expirationDate").val() });
      this.setState({ location: snapshot.child("location").val() });
      this.setState({ tags: snapshot.child("tags").val() });
      this.setState({ weight: snapshot.child("weight").val() });

      let vendorRef = firebase.database().ref(`users/${snapshot.child("userId").val()}`);
      vendorRef.once("value").then(snapshot => {
        this.setState({ vendorName: snapshot.child("vendorName").val() });
      });
    });

  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Are you sure you want to claim this pickup?</Text>
        <Text>Boxes: {this.state.boxes}</Text>
        <Text>Expiration Date: {this.state.expirationDate}</Text>
        <Text>Location: {this.state.location}</Text>
        <Text>Tags: {this.state.tags}</Text>
        <Text>Weight: {this.state.weight}</Text>
        <Text>Vendor: {this.state.vendorName}</Text>

        <View style={styles.button}>
          <Button transparent
            style={styles.innerButton}
            onPress={() => this.props.navigation.navigate('DropOffLocation', { location: this.state.location, listingId: this.state.listingId })}
          >
            <Text style={styles.buttonText}>Next</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  button: {
    backgroundColor: '#44beac',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '10%'
  },
  innerButton: {
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  }
});
