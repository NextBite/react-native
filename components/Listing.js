'use strict';

import React, { Component } from 'react';
import { Container, Content, Spinner, Toast } from 'native-base';
import firebase from 'firebase';
import ListingsForm from './ListingsForm';

export default class Listing extends Component {
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
        title: 'Create a Listing',
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

    submit(location, boxes, expirationDate, weight, tags, claimed) {
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
            claimed: claimed
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
    }
    render() {
        let spinner = null;
        if (this.state.spinnerDisplay) {
            spinner = (<Spinner />)
        }

        return (
            <Container>
                <ListingsForm submitCallback={this.submit} navigation={this.props.navigation} />
                {spinner}
            </Container>
        );
    }
}
