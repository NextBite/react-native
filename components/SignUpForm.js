'use strict';

import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button, Radio, Right, Left } from 'native-base';
import { StyleSheet, View, Text } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

export default class SignUpFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: undefined,
            firstName: undefined,
            lastName: undefined,
            password: undefined,
            passwordConfirm: undefined,
            mobile: undefined,
            personType: undefined,
            avatar: '', //optional            
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
            //display name required
            if (validations.required && value === '') {
                errors.required = true;
                errors.isValid = false;
            } 

            //display name minLength
            if (validations.minLength && value.length < validations.minLength) {
                errors.minLength = validations.minLength;
                errors.isValid = false;
            }

            //handle email type
            if (validations.email) {
                //pattern comparison from w3c
                //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
                let valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
                if (!valid) {
                    errors.email = true;
                    errors.isValid = false;
                }
            }

            // handle password confirmation
            if (validations.match) {
                if (this.state.password !== this.state.passwordConfirm) {
                    errors.match = true;
                    errors.isValid = false;
                }
            }

            // handle mobile phone number
            if (validations.phone) {
                let valid = /^([\d]{6}|((\([\d]{3}\)|[\d]{3})( [\d]{3} |-[\d]{3}-)))[\d]{4}$/.test(value);
                if (!valid) {
                    errors.phone = true;
                    errors.isValid = false;
                }
            }
        }

        if(!errors.isValid){ //if found errors
        } else if(value !== undefined){ //valid and has input
        } else { //valid and no input
            errors.isValid = false; //make false anyway
        }

        return errors; //return data object
    }

    /* A helper function that renders the appropriate error message */
    renderErrorMsg(error) {
        if (error.email) {
            return <Text style={styles.errorText}>Not a valid email address.</Text>
        } else if (error.minLength) {
            if (error.minLength <= 1) {
                return <Text style={styles.errorText}>Must be at least {error.minLength} character.</Text>
            } else {
                return <Text style={styles.errorText}>Must be at least {error.minLength} characters.</Text>
            }
        } else if (error.match) {
            return <Text style={styles.errorText}>Passwords do not match.</Text>
        } else if (error.phone) {
            return <Text style={styles.errorText}>This is not a valid phone number</Text>
        } else if (error.required) {
            return <Text>This field is required</Text>
        }
        return null
    }

    //handle signUp button
    signUp() {
        this.props.signUpCallback(this.state.email, this.state.password, this.state.firstName, this.state.lastName, this.state.mobile, this.state.personType, this.state.avatar);
    }

    render() {
        //field validation
        let emailErrors = this.validate(this.state.email, { required: true, email: true });
        let passwordErrors = this.validate(this.state.password, { required: true, minLength: 8 });
        let firstNameErrors = this.validate(this.state.firstName, { required: true, minLength: 1 });
        let lastNameErrors = this.validate(this.state.lastName, { required: true, minLength: 1 });
        let mobileErrors = this.validate(this.state.mobile, { required: true, phone: true });
        let passwordConfirmErrors = this.validate(this.state.password, { required: true, match: true })
        let typeErrors = this.validate(this.state.personType, { required: true })
        //let avatar = <Avatar>{"N"}</Avatar> // default

        //button validation
        let signUpEnabled = (emailErrors.isValid && passwordErrors.isValid && firstNameErrors.isValid && lastNameErrors.isValid && passwordConfirmErrors.isValid && mobileErrors.isValid && typeErrors.isValid);

        //radio button label and value
        let radio_props = [
            { label: 'Vendor', value: 'vendor' },
            { label: 'Volunteer', value: 'volunteer' }
        ];

        return (
            <Container style={styles.container}>
                <Content>
                    <Text style={styles.signUpTitle}>Sign Up</Text>
                    <Form>
                        <InputField
                            label='First Name'
                            keyboard='default'
                            handleChange={(text) => this.setState({ firstName: text })}
                            secure={false}
                        />
                        {this.renderErrorMsg(firstNameErrors)}
                        <InputField
                            label='Last Name'
                            keyboard='default'
                            handleChange={(text) => this.setState({ lastName: text })}
                            secure={false}
                        />
                        {this.renderErrorMsg(lastNameErrors)}
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
                        <InputField
                            label='Confirm Password'
                            keyboard='default'
                            handleChange={(text) => this.setState({ passwordConfirm: text })}
                            secure={true}
                        />
                        {this.renderErrorMsg(passwordConfirmErrors)}
                        <InputField
                            label='Mobile Number'
                            keyboard='phone-pad'
                            handleChange={(text) => this.setState({ mobile: text })}
                            secure={false}
                        />
                        {this.renderErrorMsg(mobileErrors)}
                        <Text style={{ margin: 10, fontSize: 16 }}>Please select one</Text>
                        <RadioForm
                            formHorizontal={true}
                            initial={-1}
                        >
                            <RadioButton labelHorizontal={true} >
                                <RadioButtonInput
                                    obj={{ label: 'Vendor', value: 'vendor' }}
                                    index={0}
                                    onPress={(value) => this.setState({ personType: value })}
                                    isSelected={this.state.personType === 'vendor'}
                                    borderWidth={1}
                                    buttonSize={20}
                                    buttonWrapStyle={{ marginLeft: 10 }}
                                />
                                <RadioButtonLabel
                                    obj={{ label: 'Vendor', value: 'vendor' }}
                                    index={0}
                                    labelHorizontal={true}
                                    onPress={(value) => this.setState({ personType: value })}
                                    labelStyle={{ fontSize: 16 }}
                                    labelWrapStyle={{}}
                                />
                            </RadioButton>
                            <RadioButton labelHorizontal={true} >
                                <RadioButtonInput
                                    obj={{ label: 'Volunteer', value: 'volunteer' }}
                                    index={1}
                                    onPress={(value) => this.setState({ personType: value })}
                                    isSelected={this.state.personType === 'volunteer'}
                                    borderWidth={1}
                                    buttonSize={20}
                                    buttonWrapStyle={{ marginLeft: 10 }}
                                />
                                <RadioButtonLabel
                                    obj={{ label: 'Volunteer', value: 'volunteer' }}
                                    index={1}
                                    labelHorizontal={true}
                                    onPress={(value) => this.setState({ personType: value })}
                                    labelStyle={{ fontSize: 16 }}
                                    labelWrapStyle={{}}
                                />
                            </RadioButton>
                        </RadioForm>
                        {this.renderErrorMsg(typeErrors)}
                    </Form>
                    <Button rounded
                        style={[styles.signUpButton, signUpEnabled && styles.signUpButtonAlt]}
                        onPress={() => this.signUp()}
                        disabled={!signUpEnabled}
                    >
                        <Text style={styles.buttonText}>Create Account</Text>
                    </Button>
                    <Text style={styles.text} >
                        Already have an account?
                    </Text>
                    <Button transparent
                        style={styles.signIn}
                        onPress={() => this.props.navigation.navigate('SignIn')}
                    >
                        <Text style={{ fontSize: 16 }}>Sign In Here</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const InputField = props => (
    <Item floatingLabel style={styles.inputField}>
        <Label>{props.label}</Label>
        <Input
            keyboardType={props.keyboard}
            onChangeText={props.handleChange}
            secureTextEntry={props.secure}
        />
    </Item>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    signUpTitle: {
        fontSize: 32,
        alignSelf:'center'
    },
    signUpButton: {
        width: 300,
        marginTop: 50,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    signUpButtonAlt: { //when button is enabled
        backgroundColor: '#3E7C6D'
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
    },
    errorText: {
        marginLeft: 32,
        color: '#5F174F'
    },
    text: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        alignSelf: 'center',
    },
    signIn: {
        alignSelf: 'center',
    },
    radiobutton: {
        alignSelf: 'flex-start'
    },
    inputField: {
        marginLeft:32,
        marginRight: 32
    }
});