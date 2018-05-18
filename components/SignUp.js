'use strict';

import React, { Component } from 'react';
import { Container, Content, Spinner, Toast } from 'native-base';
import firebase from 'firebase';
import SignUpForm from './SignUpForm';

export default class SignUp extends Component {
    static navigationOptions = {
        header: null
    }
    
    constructor(props) {
        super(props)
        this.state = {
            error: null, 
            showToast: false, 
            spinnerDisplay: false
        };

        this.signUp = this.signUp.bind(this);
    }
    //Lifecycle callback executed when the component appears on the screen.
    componentDidMount() {
        // Add a listener and callback for authentication events
        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if(user) { 
                this.setState({userId:user.uid});
                //this.props.history.push('/');
            }
            else{
                this.setState({userId: null}); //null out the saved state
            }
        });
    }

    //when the component is unmounted, unregister using the saved function
    componentWillUnmount() {
        if(this.unregister){ //if have a function to unregister with
            this.unregister(); //call that function!
            firebase.database().ref('users/'+this.state.userId);
        }
    }

    signUp(email, password, firstName, lastName, mobile, personType, avatar, vendorName) {
        let thisComponent = this;
        thisComponent.setState({spinnerDisplay: true}); //show loading spinner while user is being signed up
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((firebaseUser) => {
            thisComponent.setState({spinnerDisplay: false}) //do not show spinner once this is completed
            firebaseUser.updateProfile({
                email: email,
                firstName: firstName,
                lastName: lastName,
                mobile: mobile,
                personType: personType,
                photoURL: avatar,
                vendorName: vendorName
            });

            //create new entry in the Cloud DB (for others to reference)
            let userRef = firebase.database().ref('users/'+firebaseUser.uid);
            let userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                mobile: mobile,
                personType: personType,
                avatar: avatar,
                vendorName: vendorName
            }

            userRef.set(userData); //update entry in JOITC, return promise for chaining
        })
        .catch((error) => { //report any errors
            thisComponent.setState({spinnerDisplay: false});
            let errorCode = error.code;
            let errorMessage = error.message;
            if (errorCode === 'auth/email-already-in-use') {
                thisComponent.setState({error: 'The email address is already in use.'});
                thisComponent.setState({ showToast: true });
            } else if (errorCode === 'auth/invalid-email') {
                thisComponent.setState({error: 'The email address is invalid'});
                thisComponent.setState({ showToast: true });
            } else if (errorCode === 'auth/operation-not-allowed') {
                thisComponent.setState({error: 'Unable to create an account at this time, try again later.'});
                thisComponent.setState({ showToast: true });
            } else if(errorCode === 'auth/weak-password') {
                thisComponent.setState({error: 'Password is not long enough'});
                thisComponent.setState({ showToast: true });
            } else {
                thisComponent.setState({error: errorMessage});
                thisComponent.setState({showToast: true });
            }
        });
    }

    render() {
        let spinner = null;
        if (this.state.spinnerDisplay) {
            spinner = (<Spinner />)
        }

        let toast = null;
        if(this.state.showToast) {
            toast = Toast.show({
                text: this.state.error,
                buttonText: 'Okay',
                duration: 3000
            })
        }

        return (
            <Container>
                <SignUpForm signUpCallback={this.signUp} navigation={this.props.navigation} />
                {spinner}
                {toast}
            </Container>
        );
    }
}