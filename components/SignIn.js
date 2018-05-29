'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { Container, Content, Spinner, Toast } from 'native-base';
import firebase from 'firebase';
import TimerMixin from 'react-timer-mixin';

import SignInForm from './SignInForm';

export default class SignIn extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      spinnerDisplay: false,
      showToast: false,
      timerMsg: "You have been successfully signed out.",
      signedOut: false,
      personType: undefined,
    };

    this.signIn = this.signIn.bind(this);
    this.timer = this.timer.bind(this);

  }

  //Lifecycle callback executed when the component appears on the screen.
  componentDidMount() {
    // Add a listener and callback for authentication events 
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ userId: user.uid });
        this.setState({ personType: undefined });
      } else {
        this.setState({ userId: null }); //null out the saved state
        this.setState({ personType: undefined });
      }
    });
  }

  //when the component is unmounted, unregister using the saved function
  componentWillUnmount() {
    if (this.unregister) { //if have a function to unregister with
      this.unregister(); //call that function!
    }
    this.setState({ spinnerDisplay: false });;
    clearTimeout(this.timer);
  }

  timer() {
    setTimeout(() => {
      this.setState({ timerMsg: null })
    }, 3000)
  }

  //A callback function for logging in existing users
  signIn(email, password) {
    let thisComponent = this;
    thisComponent.setState({ spinnerDisplay: true }); //show spinner while user is logging in
    // Sign in the user 
    firebase.auth().signInWithEmailAndPassword(email, password) //logs in user with email and password
      .catch(function (error) { //displays an error if there is a mistake with logging a user in
        let errorMessage = error.message;
        thisComponent.setState({ spinnerDisplay: false }); //don't show spinner with error message
        thisComponent.setState({ error: errorMessage }); //put error message in state
        thisComponent.setState({ showToast: true }); //pop up toast to contain error message
      });
  }

  getSignedOut() {
    if (this.props.navigation.state.params) {
      signedOut = this.props.navigation.state.params.signedOut;
    }
    return signedOut;
  }

  render() {
    let spinner = null;
    let toast = null;
    let signedOut = false;
    let signOutMsg = null;

    if (this.state.spinnerDisplay) {
      spinner = (
        <View style={{ backgroundColor: 'rgba(0,0,0,0.9)', height: 80, }}><Spinner color="#44beac" />
        </View>)
    }

    if (this.state.showToast) {
      toast = Toast.show({
        text: this.state.error,
        buttonText: 'Okay',
        duration: 3000
      })
    }

    if (this.props.navigation.state.params) {
      signedOut = this.props.navigation.state.params.signedOut;
    }


    if (this.state.timerMsg != null && signedOut) {
      signOutMsg = (<View style={styles.messageView}>
        <Text style={styles.messageText}>
          {this.state.timerMsg}
        </Text>
      </View>)
    } else {
      signOutMsg = <View style={{ display: 'none' }}>
        <Text style={{ display: 'none' }}>
          {this.state.timerMsg}
        </Text>
      </View>;
    }
    
    if(this.state.personType !== undefined) {
      this.forceUpdate()
    }

    this.timer();

    this.state.showToast = false;
    this.state.spinnerDisplay = false;

    return (
      <Container>
        {signOutMsg}
        <SignInForm signInCallback={this.signIn} navigation={this.props.navigation} />
        {spinner}
        {toast}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  messageView: {
    alignSelf: 'center',
    backgroundColor: '#44beac',
    width: '100%',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  messageText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#f8b718',
    width: '100%',
    padding: 20,
    borderRadius: 10,
  }
});