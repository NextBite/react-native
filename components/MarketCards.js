import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

export default class MarketCards extends React.Component {
  render() {
    return (
      <Card style={styles.card}>
        <CardItem>
          <Left>
            <Body>
              <Text>{this.props.vendor}</Text>
              <Text note style={styles.subText}>{this.props.expiration}</Text>
              <Text style={styles.regText}>
                This pickup has {this.props.boxes} boxes and weighs {this.props.weight}.
              </Text>
              <Text style={styles.regText}>
                Tags: {this.props.tags}
              </Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent
              onPress={() => this.props.navigation.navigate('ClaimListing', { listingId: this.props.listingId })}
            >
              <Text>Claim Pickup</Text>
            </Button>
          </Left>
        </CardItem>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
    marginTop: 0
  },
  subText: {
    paddingBottom: 10,
  },
  regText: {
    fontSize: 14,
  }
});
