import firebase from 'firebase';
import React, { Component } from 'react';

import { View } from 'react-native';

import MapNavigator from './MapNavigator';
import Profile from './Profile';

  export default class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        signedIn: false,
      };
    }

    componentDidMount() {
      this.unregister = firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // user is signed in
          this.setState({ signedIn: true })
          this.setState({ userId: user.uid })
          var profileRef = firebase.database().ref('users/' + this.state.userId);
          profileRef.once("value")
            .then(snapshot => {
              this.setState({ personType: snapshot.child("personType").val() });
              personType = this.state.personType;
            });
        }
      });
    }

    render() {
      let content = null;

      if(this.state.personType == 'volunteer') {
        content = (<MapNavigator/>);
      } else {
        content = (<Profile/>)
      }
      return (
        <View>{content}</View>
      )
    }
  }