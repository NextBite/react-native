import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import firebase from 'firebase';

import MarketCards from './MarketCards';

export default class MarketPickups extends React.Component {
  state = {};



  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    
    return {
      title: params ? params.listingId : 'A Nested Details Screen',
    }
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const listingId = params ? params.listingId : null;

    this.setState({listingId: listingId})

  }

  render() {
      console.log(this.state.listingId)
    return (
      <View>
        <Text>Hi</Text>
      </View>
    );
  }
}

