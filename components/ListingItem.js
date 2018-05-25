'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Container, Content, Card, CardItem, Body, Button, Left, Right } from 'native-base';

export default class ListingItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    checkStatus() {
        if (this.props.claimed === 'no') {
            return (<Text style={styles.rightText}>Waiting to be claimed</Text>)
        } else if (this.props.claimed === 'yes') {
            return (
                <View>
                    <Text style={styles.rightText}>Claimed by {this.props.volunteer}</Text>
                </View>
            );
        }
    }

    deliveryStatus() {
        if (this.props.claimed === 'no') {
            return null
        } else if (this.props.claimed === 'yes') {
            if (this.props.delivered === 'no') {
                return (
                    <View style={styles.cardView} >
                        <Left style={styles.left}>
                            <Text style={styles.leftText}>Delivery Status</Text>
                        </Left>
                        <Right style={styles.right}>
                            <Text style={styles.rightText}>Not yet delivered</Text>
                        </Right>
                    </View>
                );
            } else if (this.props.delivered === 'yes') {
                return (
                    <View style={styles.cardView} >
                        <Left style={styles.left}>
                            <Text style={styles.leftText}>Delivery Status</Text>
                        </Left>
                        <Right style={styles.right}>
                            <Text style={styles.rightText}>Delivered!</Text>
                        </Right>
                    </View>
                );
            }
        }
    }
    
    dropoffLocationStatus() {
        if (this.props.claimed === 'no') {
            return null
        } else if (this.props.claimed === 'yes') {
            return (
                <View style={styles.cardView}>
                    <Left style={styles.left}>
                        <Text style={styles.leftText}>Dropoff Location</Text>
                    </Left>
                    <Right style={styles.right}>
                        <Text style={styles.rightText}>{this.props.dropoff}</Text>
                    </Right>
                </View>
            );
        }
    }


    render() {
        let timestamp = (
            <View style={styles.cardView}>
                <Left style={styles.left}>
                    <Text style={styles.leftText}>Created at</Text>
                </Left>
                <Right style={styles.right}>
                    <Text style={styles.rightText}>{this.props.timestamp}</Text>
                </Right>
            </View>
        )

        let location = (
            <View style={styles.cardView}>
                <Left style={styles.left}>
                    <Text style={styles.leftText}>Pickup Location</Text>
                </Left>
                <Right style={styles.right}>
                    <Text style={styles.rightText}>{this.props.location}</Text>
                </Right>
            </View>
        )

        let boxes = (
            <View style={styles.cardView}>
                <Left style={styles.left}>
                    <Text style={styles.leftText}>Number of Boxes</Text>
                </Left>
                <Right style={styles.right}>
                    <Text style={styles.rightText}>{this.props.boxes}</Text>
                </Right>
            </View>
        )

        let weight = (
            <View style={styles.cardView}>
                <Left style={styles.left}>
                    <Text style={styles.leftText}>Approx. weight</Text>
                </Left>
                <Right style={styles.right}>
                    <Text style={styles.rightText}>{this.props.weight}</Text>
                </Right>
            </View>
        )

        let tags = (
            <View style={styles.cardView}>
                <Left style={styles.left}>
                    <Text style={styles.leftText}>Types of Food</Text>
                </Left>
                <Right style={styles.right}>
                    <Text style={styles.rightText}>{this.props.tag}</Text>
                </Right>
            </View>
        )

        let expiration = (
            <View style={styles.cardView}>
                <Left style={styles.left}>
                    <Text style={styles.leftText}>Latest Pickup Time</Text>
                </Left>
                <Right style={styles.right}>
                    <Text style={styles.rightText}>{this.props.expiration}</Text>
                </Right>
            </View>
        )

        let status = (
            <View style={styles.cardView}>
                <Left style={styles.left}>
                    <Text style={styles.leftText}>Donation Status</Text>
                </Left>
                <Right style={styles.right}>
                    {this.checkStatus()}
                </Right>
            </View>
        )

        let buttons = (
            <View style={styles.cardView}>
                <Left style={styles.leftButton}>
                    <Button transparent>
                        <Text>Edit</Text>
                    </Button>
                </Left>
                <Right style={styles.rightButton}>
                    <Button transparent>
                        <Text>Delete</Text>
                    </Button>
                </Right>
            </View>
        )

        return (
            <Card style={styles.card}>
                <CardItem>
                    <Body>
                        {timestamp}
                        {location}
                        {boxes}
                        {weight}
                        {tags}
                        {expiration}
                        {status}
                        {this.deliveryStatus()}
                        {this.dropoffLocationStatus()}
                    </Body>
                </CardItem>
                <CardItem footer bordered style={styles.footer}>
                    <View style={styles.cardView}>
                        <Left style={styles.leftButton}>
                            <Button transparent
                            >
                                <Text style={styles.buttonText}>EDIT</Text>
                            </Button>
                        </Left>
                        <Right style={styles.rightButton}>
                            <Button transparent
                            >
                                <Text style={styles.buttonText}>DELETE</Text>
                            </Button>
                        </Right>
                    </View>
                </CardItem>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    cardView: {
        flex: 1,
        flexDirection: 'row'
    },
    left: {
        flex: 4,
    },
    right: {
        flex: 6,
        alignItems: 'flex-start',
        borderLeftWidth: 2,
        borderLeftColor: '#44beac'
    },
    leftText: {
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 10,
        color: '#247f6e'
    },
    rightText: {
        marginLeft: 10,
        fontSize: 15,
        marginBottom: 10,
    },
    leftButton: {
        flex: 1,
        justifyContent: 'center',
    },
    rightButton: {
        flex: 1,
        alignItems: 'center',
    },
    card: {
        elevation: 0,
    },
    buttonText: {
        fontSize: 16,
    },
    footer: {
        backgroundColor: '#f6f6f6'
    }
});