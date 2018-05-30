import React, { Component } from 'react';
import { Container, View, Spinner, Toast } from 'native-base';
import { StyleSheet } from 'react-native';
import firebase from 'firebase';

import HeaderComponent from './HeaderComponent';
import EditRescueForm from './EditRescueForm';

export default class EditRescue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      showToast: false,
      spinnerDisplay: false,
      title: "Edit Donation Listing"
    }
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.unregister = firebase.auth().onAuthStateChanged(user => {

    });
  }

  componentWillUnmount() {
    if (this.unregister) {
      this.unregister();
    }
  }

  submit(location, boxes, expirationDate, weight, tags, claimed, listingId) {
    console.log("listingId", listingId)
    this.setState({ spinnerDisplay: true }); //show loading spinner while user submits form

    let listingsRef = firebase.database().ref(`listings/${listingId}`);
    listingsRef.update({ location: location, boxes: boxes, expirationDate: expirationDate, weight: weight, tags: tags });
  }

  render() {
    let spinner = null;
    if (this.state.spinnerDisplay) {
      spinner = (<Spinner />)
    }

    return (
        <Container>
          <HeaderComponent {...this.props} title={this.state.title} />
          <EditRescueForm submitCallback={this.submit} navigation={this.props.navigation} />
          {spinner}
        </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    marginBottom: 56,
  },
});