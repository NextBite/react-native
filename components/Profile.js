import React, { Component } from 'react';
import HeaderComponent from './HeaderComponent';
import {
    Text, View, Image, TouchableHighlight
} from 'react-native';
const backgroundColor = '#964f8e';
import { Icon } from 'native-base';


export default class Profile extends Component {
static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Profile';
    let drawerIcon = () => (
      <Icon 
        name= "menu" 
        style={{marginLeft: 20, color: "#fff", backgroundColor: '#44beac'}} 
        size={28} 
      />
    );
    return { drawerLabel, };
  }

  render() {
    return (<View style={{
        flex: 1,
        flexDirection: 'column',
    }}>
        <HeaderComponent {...this.props} />
        <View style={{
            flex: 1,
            backgroundColor: backgroundColor,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>
                This is Cloud Screen
            </Text>                                
        </View>
</View>);
  }
}