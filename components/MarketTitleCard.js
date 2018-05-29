import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackgroundImage } from './BackgroundImage';


export default class MarketTitleCard extends React.Component {
  render() {
    let source = { uri: 'https://images.pexels.com/photos/375896/pexels-photo-375896.jpeg' };
    return (
      <View style={{ width: '100%', height: 200, backgroundColor: '#000000' }}>
        <BackgroundImage
          resizeMode="cover"
          opacity={0.6}
          source={source}
        />
        <Text style={{ fontSize: 36, fontFamily: 'Montserrat-Bold', color: '#ffffff', textAlign: 'center', marginTop: 40 }}>{this.props.marketName}</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <Icon
            name="location-on"
            style={{ color: "#f8b718", margin: 0, padding: 0 }}
            size={20} /><Text note style={styles.subText}> University Way NE, Seattle, WA 98105</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
    marginTop: 0,
    height: '100%',
    width: '100%'
  },
  subText: {
    textAlign: 'center',
    marginRight: 0,
    color: '#ffffff',
    fontSize: 16,
    margin: 0,
    padding: 0,
  },
  regText: {
    fontSize: 14,
  }
});
