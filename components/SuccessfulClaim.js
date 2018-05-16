import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from 'native-base';
import firebase from 'firebase';

export default class SuccessfulClaim extends React.Component {
  state = {};

  static navigationOptions = {
    title: 'Successful Claim',
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const nonprofit = params ? params.nonprofit : null;
    const coords = params ? params.coords : null;
    const listingId = params ? params.listingId : null;

    this.setState({nonprofit: nonprofit, coords: coords, listingId: listingId});

    firebase.database().ref().child(`listings/${listingId}`)
        .update({ claimed: "yes", dropoffLocation: coords });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: '100%', height: '50%' }}
          source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${this.state.coords.lat},${this.state.coords.long}&zoom=16&size=400x400&scale=2&maptype=roadmap&markers=color:red|label:|${this.state.coords.lat},${this.state.coords.long}&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE` }}
        />
        <Text style={styles.message}>You're delivering this donation to {this.state.nonprofit}!</Text>

          <Button transparent
            style={styles.innerButton}
            onPress={() => this.props.navigation.navigate('')}
          >
            <Text style={styles.buttonText}>Pending Rescues</Text>
          </Button>
          <Button transparent
            style={styles.innerButton}
            onPress={() => this.props.navigation.navigate('')}
          >
            <Text style={styles.buttonText}>Get Directions</Text>
          </Button>

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
  },
  innerButton: {
    backgroundColor: '#44beac',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  message: {
    padding: '10%',
    textAlign: 'center'
  }
});
