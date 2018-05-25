'use strict';

import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button } from 'native-base';
import firebase from 'firebase';
import ListingItem from './ListingItem';

export default class CurrentDonations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            donationCards: []
        };
    }

    static navigationOptions = {
        title: 'Current Donations',
    };

    componentDidMount() {
        let userListings = [];
        let currentDonationCards = [];
        let volunteerName = ""

        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // query for vendor's listingIds
                let listingRef = firebase.database().ref(`users/${user.uid}/pendingRescues`);
                listingRef.on('value', (snapshot) => {
                    snapshot.forEach(function (child) {
                        let listingObj = child.val();
                        userListings.push(listingObj.listingId)
                    });

                    //query for details of each listing
                    let listings = userListings.map((listingId) => {
                        let listingDetailRef = firebase.database().ref(`listings/${listingId}`);
                        listingDetailRef.on('value', (snapshot) => {
                            let listingDetailObj = {};
                            snapshot.forEach(function (child) {
                                listingDetailObj[child.key] = child.val()

                            });

                            listingDetailObj["listingId"] = listingId;
                            // retrieve volunteer's name for the listing
                            let usersRef = firebase.database().ref(`users/${listingDetailObj.claimedBy}`);
                            usersRef.once('value', (snapshot) => {
                                volunteerName = `${snapshot.child("firstName").val()} ${snapshot.child("lastName").val()}`;
                                currentDonationCards.push(<ListingItem
                                    timestamp={new Date(listingDetailObj.time)}
                                    location={listingDetailObj.location}
                                    boxes={listingDetailObj.boxes}
                                    weight={listingDetailObj.weight}
                                    tag={listingDetailObj.tags}
                                    expiration={listingDetailObj.expirationDate}
                                    claimed={listingDetailObj.claimed}
                                    volunteer={volunteerName}
                                    delivered={listingDetailObj.delivered}
                                    dropoff={listingDetailObj.dropoffLocation}
                                    listingID={listingDetailObj.listingId}
                                />);

                                currentDonationCards.sort(function (a, b) {
                                    return new Date(a.props.expiration) - new Date(b.props.expiration);
                                });
                                this.setState({ donationCards: currentDonationCards })
                            });
                        });
                    });
                });
            } else {
                this.setState({ userId: null })
            }
        });
    }

    componentWillUnmount() {
        if (this.unregister) {
            this.unregister();
        }
    }

    render() {
        return (
            <ScrollView style={styles.cards}>
                {this.state.donationCards}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cards: {
        width: '100%',
        height: '100%',
        padding: 10
    }
});