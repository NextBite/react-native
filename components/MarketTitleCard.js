import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

export default class MarketTitleCard extends React.Component {
  render() {
    return (
      <Card style={styles.card}>
        <CardItem>
          <Left>
            <Body>
              <Text style={styles.titleText}>{this.props.marketName}</Text>
              <Text note style={styles.subText}>University Way NE, Seattle, WA 98105</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem cardBody>
          <Image source={{ uri: 'https://images.pexels.com/photos/375896/pexels-photo-375896.jpeg' }} style={{ height: 200, width: null, flex: 1 }} />
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
  titleText: {
    textAlign: 'center'
  },
  subText: {
    paddingBottom: 10,
    textAlign: 'center',
    marginRight: 0
  },
  regText: {
    fontSize: 14,
  }
});
