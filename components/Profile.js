import React, { Component } from 'react';
import HeaderComponent from './HeaderComponent';
import {
  Text, View, Image, TouchableHighlight
} from 'react-native';
const backgroundColor = '#964f8e';
import { Icon } from 'native-base';


export default class Profile extends Component {
  state = {
    title: "Profile",
  }

  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Profile';
    let drawerIcon = () => (
      <Icon 
        name= "person" 
        style={{color: "#44beac",}} 
        size={28} 
      />
    );
    return { drawerLabel, drawerIcon};
  }

  render() {
    return (<View style={{
      flex: 1,
      flexDirection: 'column', 
    }}>
      <HeaderComponent {...this.props} title={this.state.title} />
      <View style={{
        flex: 1,
        backgroundColor: '#000',
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