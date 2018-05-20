'use strict';

import React, { Component } from 'react';
import { Container, Content, Spinner, Toast } from 'native-base';
import firebase from 'firebase';
import SignInForm from './SignInForm';

export default class SignIn extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            spinnerDisplay: false,
            showToast: false,
        };

        this.signIn = this.signIn.bind(this);
    }

    //Lifecycle callback executed when the component appears on the screen.
    componentDidMount() {
        // Add a listener and callback for authentication events 
        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ userId: user.uid });
            } else {
                this.setState({ userId: null }); //null out the saved state
            }
        });
    }

    //when the component is unmounted, unregister using the saved function
    componentWillUnmount() {
        if (this.unregister) { //if have a function to unregister with
            this.unregister(); //call that function!
        }
        this.setState({spinnerDisplay: false});
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

    render() {
        let spinner = null;
        if (this.state.spinnerDisplay) {
            spinner = (<Spinner />)
        }

        let toast = null;
        if (this.state.showToast) {
            toast = Toast.show({
                text: this.state.error,
                buttonText: 'Okay',
                duration: 3000
            })
        }

        return (
            <Container>
                <SignInForm signInCallback={this.signIn} navigation={this.props.navigation} />
                {spinner}
                {toast}
            </Container>
        );
    }
}