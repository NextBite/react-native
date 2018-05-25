'use strict';

import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import firebase from 'firebase';
import ListingItem from './ListingItem';
import { Icon } from 'native-base';
import HeaderComponent from './HeaderComponent';

export default class CurrentDonations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            donationCards: [],
            title: "Current Donations"
        };
        this.readableTime = this.readableTime.bind(this)
    }

    static navigationOptions = ({ navigation }) => {
        let drawerLabel = 'Current Donations';
        let drawerIcon = () => (
          <Icon 
            name= "person" 
            style={{color: "#44beac",}} 
            size={28} 
          />
        );
        return { drawerLabel, drawerIcon};
      }

    componentDidMount() {
        let userListings = [];
        let currentDonationCards = [];

        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log("user uid", user.uid)
                // query for vendor's listingIds
                let listingRef = firebase.database().ref(`users/${user.uid}/pendingRescues`);
                listingRef.on('value', (snapshot) => {
                    snapshot.forEach(function (child) {
                        console.log("child", child.val())
                        let listingObj = child.val();
                        userListings.push(listingObj.listingId)
                    });
                    //this.setState({ userListingsId: userListings })
                    console.log("user listings", userListings)

                    //query for details of each listing
                    let listings = userListings.map((listingId) => {
                        console.log("listingId", listingId)
                        let volunteerName = ""
                        let listingDetailRef = firebase.database().ref(`listings/${listingId}`);
                        listingDetailRef.on('value', (snapshot) => {
                            let listingDetailObj = {};
                            snapshot.forEach(function (child) {
                                listingDetailObj[child.key] = child.val()
                                console.log("listing id child", child.val())
                                console.log("child key", child.key)
                            });

                            listingDetailObj["listingId"] = listingId;
                            console.log("claimed by", listingDetailObj.claimedBy)
                            // retrieve volunteer's name for the listing
                            let usersRef = firebase.database().ref(`users/${listingDetailObj.claimedBy}`);
                            usersRef.once('value', (snapshot) => {
                                volunteerName = `${snapshot.child("firstName").val()} ${snapshot.child("lastName").val()}`;
                                console.log("ahahah", volunteerName)

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
        console.debug(dt);
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
            <View style={styles.view}>
            <HeaderComponent {...this.props} title={this.state.title} />
            <ScrollView style={styles.cards}>
                {this.state.donationCards}
            </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cards: {
        width: '100%',
        height: '100%',
        padding: 10,
    },
    view: {
        marginBottom: 70,
    }
});