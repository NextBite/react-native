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
        this.readableTime = this.readableTime.bind(this);
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
                                    timestamp={this.readableTime(new Date(listingDetailObj.time))}
                                    location={listingDetailObj.location.split(",")[0]}
                                    boxes={listingDetailObj.boxes}
                                    weight={listingDetailObj.weight}
                                    tag={listingDetailObj.tags}
                                    expiration={this.readableTime(listingDetailObj.expirationDate)}
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

    readableTime(time) {
        let dt = time.toString().slice(0, -18).split(" ");
        let hour = dt[4].split(":")[0];
        if (parseInt(hour) > 0 && parseInt(hour) < 12) {
            dt[4] = dt[4] + " AM";
        } else if (parseInt(hour) > 12) {
            dt[4] = (parseInt(hour) - 12).toString() + ":" + dt[4].split(":")[1] + " PM";
        } else if (parseInt(hour) === 12) {
            dt[4] = dt[4] + " PM";
        } else if (parseInt(hour) === 0) {
            dt[4] = "12:" + dt[4].split(":")[1] + " AM";
        }
        return dt[0] + " " + dt[1] + " " + dt[2] + " " + dt[3] + ", " + dt[4];
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