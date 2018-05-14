import React, { Component } from 'react';
import {
  Text, View, Image, TouchableHighlight
} from 'react-native';
import { Icon, Button } from 'native-base';

export default class HeaderComponent extends Component {
  render() {
    return (<View style={{
      height: 90,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }}>
      <TouchableHighlight 
        style={{ marginLeft: 10, marginTop: 20 }}
        onPress={() => {
          const { navigate } = this.props.navigation;
          navigate('DrawerOpen');
        }}>
        <Icon 
        name= "menu" 
        style={{marginLeft: 20, color: "#fff", backgroundColor: '#44beac'}} 
        size={28} 
      />
      </TouchableHighlight>
    </View>);
  }
}
