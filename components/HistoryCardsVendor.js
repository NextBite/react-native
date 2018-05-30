'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import { Container, Content, Card, CardItem, Body, Button, Left, Right } from 'native-base';
import firebase from 'firebase';

export default class HistoryCardsVendor extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
    let timestamp = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Created at</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.readableTime(this.props.timestamp)}</Text>
        </Right>
      </View>
    );

    let location = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Pickup Location</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.location.split(",")[0]}</Text>
        </Right>
      </View>
    );

    let boxes = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Number of Boxes</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.boxes}</Text>
        </Right>
      </View>
    );

    let weight = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Approx. weight</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.weight}</Text>
        </Right>
      </View>
    );

    let tags = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Types of Food</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.tag}</Text>
        </Right>
      </View>
    );

    let expiration = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Expiration Time</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.readableTime(this.props.expiration)}</Text>
        </Right>
      </View>
    );

    let claimedBy = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Claimed By</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.volunteer}</Text>
        </Right>
      </View>
    );

    let dropoffLocation = (
      <View style={styles.cardView}>
        <Left style={styles.left}>
          <Text style={styles.leftText}>Dropoff Location</Text>
        </Left>
        <Right style={styles.right}>
          <Text style={styles.rightText}>{this.props.dropoff}</Text>
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
            {claimedBy}
            {dropoffLocation}
          </Body>
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
  cardViewAlt: {
    flex: 1,
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
    marginBottom: 10
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
});