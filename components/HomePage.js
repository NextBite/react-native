'use strict';

import React, { Component } from 'react';
import { Text } from 'react-native';
import { Container, Button } from 'native-base';
import firebase from 'firebase';

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {}

        this.signOut = this.signOut.bind(this);
    }
    

    componentDidMount() {
        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                this.setState({userId: user.uid})
            } else {
                this.setState({userId:null})
            }
        });
    }

    componentWillUnmount() {
        if(this.unregister) {
            this.unregister()
        }
    }

    signOut() {
        firebase.auth().signOut().then(() => this.props.navigation.navigate("SignedOut"))
    }
    render() {
        return (
            <Container>
                <Button onPress={() => this.signOut()}>
                    <Text>Sign Out</Text>
                </Button>
            </Container>
        );
    }
}
