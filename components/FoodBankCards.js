import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

export default class FoodBankCards extends React.Component {
  render() {
    return (
      <Card style={styles.card}>
        <CardItem>
          <Left>
            <Body>
              <Text style={styles.nonprofitName}>{this.props.title}</Text>
              <Text note style={styles.subText}>{this.props.distance}</Text>
              <Text style={styles.regText}>
                Open from {String(this.props.openTime)} to {String(this.props.closeTime)} today.
              </Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent
              style={styles.innerButton}
              onPress={() => this.props.navigation.navigate('SuccessfulClaim', { nonprofit: this.props.title, coords: this.props.coords, listingId: this.props.listingId, marketId: this.props.marketId, marketName: this.props.marketName })}
            >
              <Text style={styles.buttonText}>Choose Location</Text>
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
  },
  innerButton: {
    backgroundColor: '#44beac',
    alignSelf: 'center',
    alignItems: 'center',
    paddingRight: 0,
    marginLeft: 8
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  nonprofitName: {
    color: '#247f6e',
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
  }
});
