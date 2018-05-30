import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

export default class MapCards extends React.Component {
  render() {
    return (
      <Card style={styles.card}>
        <CardItem>
          <Left>
            <Body>
              <Text style={styles.marketName}>{this.props.title}</Text>
              <Text note style={styles.subText}>{this.props.distance}</Text>
              <Text style={styles.regText}>
                There are {this.props.count} pickup(s) available.
              </Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent
              style={styles.innerButton}
              onPress={() => this.props.navigation.navigate('MarketPickups', { marketName: this.props.title })}
            >
              <Text style={styles.buttonText}>View</Text>
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
  marketName: {
    color: '#247f6e',
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
  }
});
