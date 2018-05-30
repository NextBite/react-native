import React from 'react';
import { StyleSheet, Text, View, Image, Platform, Linking } from 'react-native';
import { Button } from 'native-base';
import firebase from 'firebase';
import HeaderComponent from './HeaderComponent';

export default class SuccessfulClaim extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: "Successful Claim" };

    this.openMaps = this.openMaps.bind(this);
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const nonprofit = params ? params.nonprofit : null;
    const coords = params ? params.coords : null;
    const listingId = params ? params.listingId : null;
    const marketId = params ? params.marketId : null;
    const marketName = params ? params.marketName : null;

    this.setState({ nonprofit: nonprofit, coords: coords, listingId: listingId });

    let currUser = firebase.auth().currentUser.uid;

    // update the listing entry to reflect that it's been 
    // claimed by a volunteer
    firebase.database().ref().child(`listings/${listingId}`)
        .update({ claimed: "yes", dropoffLocation: { lat: coords.lat, long: coords.long, name: nonprofit }, claimedBy: currUser });

    // remove it from entires that are shown for each market
    firebase.database().ref(`markets/${marketName.split(",")[0]}/${marketId}`).remove();

    let usersRef = firebase.database().ref('users/' + currUser + '/claimedRescues');
    let newUserListing = {
      listingId: listingId,
    }
    usersRef.push(newUserListing);
  }

  openMaps() {
    const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=:';
    const latLng = `${this.state.coords.lat},${this.state.coords.long}`;
    const label = `${this.state.nonprofit}`;
    const url = Platform.OS === 'ios' ? `${scheme}${label}@${latLng}` : `${scheme}${latLng}(${label})`;

    Linking.openURL(url);
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderComponent {...this.props} title={this.state.title} />
        <Image
          style={{ width: '100%', height: '50%' }}
          source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${this.state.coords.lat},${this.state.coords.long}&zoom=16&size=400x400&scale=2&maptype=roadmap&markers=color:red|label:|${this.state.coords.lat},${this.state.coords.long}&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE` }}
        />
        <Text style={styles.message}>You're delivering this donation to {this.state.nonprofit}!</Text>
        <Button transparent
          style={styles.innerButton}
          onPress={() => this.props.navigation.navigate('VolunteerPendingRescues', {})}
        >
          <Text style={styles.buttonText}>Pending Rescues</Text>
        </Button>
        <Button transparent
          style={styles.innerButton}
          onPress={() => this.openMaps()}
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
