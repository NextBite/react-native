'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, KeyboardAvoidingView } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button } from 'native-base';

export default class SignInForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'email': undefined,
            'password': undefined,
        };
    }

    /**
     * A helper function to validate a value based on a hash of validations
     * second parameter has format e.g.,
     * {required: true, minLength: 5, email: true}
     * (for required field, with min length of 5, and valid email)
     */
    validate(value, validations) {
        let errors = { isValid: true };

        if (value !== undefined) { //check validations
            if (validations.required && value === '') {
                errors.required = true;
                errors.isValid = false;
            }

            if (validations.minLength && value.length < validations.minLength) {
                errors.minLength = validations.minLength;
                errors.isValid = false;
            }

            //handle email type
            if (validations.email) {
                //pattern comparison from w3c
                //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
                let valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
                if (!valid) {
                    errors.email = true;
                    errors.isValid = false;
                }
            }
        }

        if (!errors.isValid) { //if found errors
        } else if (value !== undefined) { //valid and has input
        } else { //valid and no input
            errors.isValid = false; //make false anyway
        }

        return errors; //return data object
    }

    // handle sign in button
    signIn() {
        this.props.signInCallback(this.state.email, this.state.password);
    }

    /* A helper function that renders the appropriate error message */
    renderErrorMsg(error) {
        if (error.email) {
            return <Text style={styles.errorText}>Not a valid email address.</Text>
        } else if (error.minLength) {
            return <Text style={styles.errorText}>Password must be at least {error.minLength} characters.</Text>
        }
        return null
    }

    render() {
        let emailErrors = this.validate(this.state.email, { required: true, email: true });
        let passwordErrors = this.validate(this.state.password, { required: true, minLength: 8 });

        //button validation
        let signInEnabled = (emailErrors.isValid && passwordErrors.isValid);
        return (
            <KeyboardAvoidingView style={styles.container} >
                <Content>
                    <Image source={require('./resources/img/logo.png')} style={styles.logo}/>
                    <Form>
                        <InputField
                            label='Email'
                            keyboard='email-address'
                            handleChange={(text) => this.setState({ email: text })}
                            secure={false}
                        />
                        {this.renderErrorMsg(emailErrors)}
                        <InputField
                            label='Password'
                            keyboard='default'
                            handleChange={(text) => this.setState({ password: text })}
                            secure={true}
                        />
                        {this.renderErrorMsg(passwordErrors)}
                    </Form>
                    <Button
                        style={[styles.signInButton, signInEnabled && styles.signInButtonAlt]}
                        onPress={() => this.signIn()}
                        disabled={!signInEnabled}
                    >
                        <Text style={styles.buttonText}>
                            Sign In
                        </Text>
                    </Button >
                    <Text style={styles.noAccount} >
                        Don't have an account yet?
                    </Text>
                    <Button transparent
                        style={styles.signUp}
                        onPress={() => this.props.navigation.navigate('SignUp')}
                    >
                        <Text style={{ fontSize: 20, color: 'white' }}>Sign up here</Text>
                    </Button>
                </Content>
            </KeyboardAvoidingView>
        );
    }
}

const InputField = props => (
    <Item floatingLabel style={styles.inputField}>
        <Label style={styles.inputLabel}>{props.label}</Label>
        <Input
            keyboardType={props.keyboard}
            onChangeText={props.handleChange}
            secureTextEntry={props.secure}
            style={styles.input}
        />
    </Item>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#44beac'
    },
    signInButton: {
        width: '70%',
        marginTop: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        elevation: 0,
        backgroundColor: '#CCCCCC'
    },
    signInButtonAlt: { //when button is enabled
        backgroundColor: '#f6f6f6'
    },
    buttonText: {
        fontSize: 24,
        color: '#474748',
    },
    noAccount: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 20,
        alignSelf: 'center',
    },
    signUp: {
        alignSelf: 'center',
    },
    logo: {
        alignSelf: 'center',
        borderRadius: 20,
        marginTop: '20%'
    },
    inputField: {
        width: '80%',
        alignSelf: 'center'
    },
    input: {
        color: 'white'
    },
    inputLabel: {
        fontSize: 16,
        color: 'white'
    },
    errorText: {
        fontSize: 16,
        marginLeft: '10%',
        color: '#5F174F'
    }
});