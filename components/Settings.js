import React, { Component } from 'react';
import firebase from 'firebase';
import HeaderComponent from './HeaderComponent';
import {
  Text, View, Image, TouchableHighlight, StyleSheet, Linking
} from 'react-native';
import { Avatar } from 'react-native-elements'
import { Button, Container, Header, Content, Tab, Tabs } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default class Settings extends Component {
  state = {
    title: "Settings",
    firstName: undefined,
    lastName: undefined,
    personType: undefined,
    mobile: undefined
  }

  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Settings';
    let drawerIcon = () => (
      <Icon
        name="settings"
        style={{ color: "#44beac", marginLeft: -3 }}
        size={28}
      />
    );
    return { drawerLabel, drawerIcon };
  }

  componentDidMount() {
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // user is signed in
        this.setState({ userId: user.uid })
        var profileRef = firebase.database().ref('users/' + this.state.userId);
        profileRef.once("value")
          .then(snapshot => {
            this.setState({ personType: snapshot.child("personType").val() });
            this.setState({ firstName: snapshot.child("firstName").val() });
            this.setState({ lastName: snapshot.child("lastName").val() });
            this.setState({ mobile: snapshot.child("mobile").val() });
          });
      } else {
        this.setState({ userId: null }); //null out the saved state
        this.setState({ personType: undefined }); //null out the saved state
        this.setState({ firstName: null }); //null out the saved state
        this.setState({ lastName: undefined }); //null out the saved state
        this.setState({ mobile: undefined }); //null out the saved state
      }
    });
  }

  render() {

    return (<View style={{
      flex: 1,
      flexDirection: 'column',
    }}>
      <HeaderComponent {...this.props} title={this.state.title} />
        <Text>Settings</Text>

    </View>);
  }
}

const styles = StyleSheet.create({

});