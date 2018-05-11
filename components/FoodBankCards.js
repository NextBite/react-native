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
              <Text>{this.props.title}</Text>
              <Text note style={styles.subText}>{this.props.distance} mi</Text>
              <Text style={styles.regText}>
                food bank info 
              </Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent
              onPress={() => this.props.navigation.navigate('SuccessfulClaim', { nonprofit: this.props.title, coords: this.props.coords })}
            >
              <Text>Choose Location</Text>
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
