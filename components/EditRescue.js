import React, { Component } from 'react';
import { Container, Content, Spinner, Toast } from 'native-base';
import firebase from 'firebase';
import EditRescueForm from './EditRescueForm';

export default class EditRescue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      showToast: false,
      spinnerDisplay: false
    }
    this.submit = this.submit.bind(this);
  }

  static navigationOptions = {
    title: 'Edit Rescue',
  };

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
    listingsRef.update({ location: location, boxes: boxes, expirationDate: expirationDate, weight: weight, tags: tags});
  }

  render() {
    let spinner = null;
    if (this.state.spinnerDisplay) {
      spinner = (<Spinner />)
    }

    return (
      <Container>
        <EditRescueForm submitCallback={this.submit} navigation={this.props.navigation} />
        {spinner}
      </Container>
    );
  }
}