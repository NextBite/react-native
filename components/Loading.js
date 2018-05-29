import React, { Component } from 'react';
import { View } from 'react-native';
import { Spinner, Header } from 'native-base';

export default class Profile extends Component {

  render() {
    return (<View style={{
      flex: 1,
      flexDirection: 'column', 
    }}>
      <View style={{
        flex: 1,
        backgroundColor: '#44beac',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Header style={{ height: 0, width: 0 }} androidStatusBarColor='#35a08e'></Header>
      <Spinner color="#f8b718" />
      </View>
    </View>);
  }
}