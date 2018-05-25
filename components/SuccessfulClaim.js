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
    const marketId = params ? params.marketId : null;
    const marketName = params ? params.marketName : null;

    this.setState({nonprofit: nonprofit, coords: coords, listingId: listingId});

    // update the listing entry to reflect that it's been 
    // claimed by a volunteer
    firebase.database().ref().child(`listings/${listingId}`)
        .update({ claimed: "yes", dropoffLocation: coords });

    // remove it from entires that are shown for each market
    firebase.database().ref(`markets/${marketName.split(",")[0]}/${marketId}`).remove();

    // lGtcBwxX1XWtdioXbuEmQQUuTVn1 hard corded volunteer id 
    let currUser = "lGtcBwxX1XWtdioXbuEmQQUuTVn1"; // should be firebase.auth().currentUser.uid;
    let usersRef = firebase.database().ref('users/' + currUser + '/claimedRescues');
    let newUserListing = {
      listingId: listingId,
    }
    usersRef.push(newUserListing);
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
            onPress={() => this.props.navigation.navigate('VolunteerPendingRescues', {})}
          >
            <Text style={styles.buttonText}>Pending Rescues</Text>
          </Button>
          <Button transparent
            style={styles.innerButton}
            onPress={() => this.props.navigation.navigate('VolunteerPendingRescues')}
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
