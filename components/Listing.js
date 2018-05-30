import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Content, Spinner, Toast } from 'native-base';
import firebase from 'firebase';

import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

import HeaderComponent from './HeaderComponent';
import ListingsForm from './ListingsForm';

export default class Listing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      showToast: false,
      spinnerDisplay: false,
      title: "Create a Listing",
      personType: undefined
    }
    this.submit = this.submit.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Create a Listing';
    let drawerIcon = () => (
      <Svg height="24" width="24">
        <Path fill="#44BEAC" d="M15.5,3.9h-1.4V3.3c0-0.5-0.4-0.8-0.8-0.8h-1.1C11.9,0.9,10.4-0.2,8.8,0C7.5,0.2,6.5,1.2,6.3,2.5H5.2
          c-0.5,0-0.8,0.4-0.8,0.8v0.5H3c-1.7,0-3,1.3-3,3V21c0,1.7,1.3,3,3,3h12.5c1.7,0,3-1.3,3-3V6.9C18.5,5.2,17.2,3.9,15.5,3.9L15.5,3.9z
          M6,4.1h1.1c0.5,0,0.8-0.4,0.8-0.8V3c0-0.7,0.6-1.3,1.3-1.3c0.7,0,1.3,0.6,1.3,1.3v0.4c0,0.5,0.4,0.8,0.8,0.8h1.1V6H6V4.1z
          M13.3,13.3l-4.7,4.2c-0.2,0.1-0.3,0.2-0.5,0.2h0c-0.2,0-0.4-0.1-0.6-0.3l-2.3-2.7c-0.3-0.3-0.3-0.9,0.1-1.2
          c0.3-0.3,0.9-0.3,1.2,0.1l0,0l1.8,2l4.1-3.6c0.3-0.3,0.9-0.3,1.2,0.1C13.7,12.4,13.7,13,13.3,13.3L13.3,13.3z"/>
      </Svg>
    );
    return { drawerLabel, drawerIcon };
  }

  componentWillMount() {
    /* Add a listener and callback for authentication events */
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ userId: user.uid });
      }
      else {
        this.setState({ userId: null }); //null out the saved state
        this.setState({ personType: undefined }); //null out the saved state
      }
    });

    this.setState({ key: Math.random() });
  }

  //when the component is unmounted, unregister using the saved function
  componentWillUnmount() {
    if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
    }
}
  submit(location, boxes, expirationDate, weight, tags, claimed, claimedBy, delivered, dropoffLocation) {
    console.log(claimed)
    console.log(location)
    let thisComponent = this;
    thisComponent.setState({ spinnerDisplay: true }); //show loading spinner while user submits form

    let listingsRef = firebase.database().ref('listings');
    let newListing = {
      location: location,
      boxes: boxes,
      expirationDate: String(expirationDate),
      weight: weight,
      tags: tags,
      time: firebase.database.ServerValue.TIMESTAMP,
      userId: firebase.auth().currentUser.uid,
      claimed: claimed,
      claimedBy: claimedBy,
      delivered: delivered,
      pickedUp: "no",
      dropoffLocation: dropoffLocation
    }

    let listing = listingsRef.push(newListing); // upload msg to database
    let listingId = listing.key;

    /* Add listing to user's id */
    let currUser = firebase.auth().currentUser.uid;
    let usersRef = firebase.database().ref('users/' + currUser + '/listings');
    let newUserListing = {
      listingId: listingId,
    }
    usersRef.push(newUserListing);

    /* Add listing to appropriate farmer's market */
    console.log(location.split(",")[0])
    let marketsRef = firebase.database().ref(`markets/${location.split(",")[0]}`);
    let newMarketListing = {
      listingId: listingId,
      expirationDate: String(expirationDate),
    }
    console.log(newMarketListing)
    marketsRef.push(newMarketListing);

    // Add listing to pending rescues
    let pendingRef = firebase.database().ref(`users/${currUser}/pendingRescues`);
    let newPendingListing = {
        listingId: listingId
    }
    pendingRef.push(newPendingListing);
  }

  render() {
    let spinner = null;
    if (this.state.spinnerDisplay) {
      spinner = (<View style={{ backgroundColor: 'rgba(0,0,0,0.9)', height: 80, }}><Spinner color="#44beac" />
      </View>)
    }

    return (
      <Container>
        <HeaderComponent {...this.props} title={this.state.title} />
        <ListingsForm submitCallback={this.submit} navigation={this.props.navigation} key={this.state.key} />
        {spinner}
      </Container>
    );
  }
}

