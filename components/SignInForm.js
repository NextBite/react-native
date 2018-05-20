'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, KeyboardAvoidingView } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Icon, Header } from 'native-base';
import SVGImage from 'react-native-svg-image';
import Svg,{
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

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
        <Header style={{ height: 0, }} androidStatusBarColor='#35a08e'></Header>
        <Content>
          <Svg  
            style={ styles.logo }
          >
            <Rect x="-6" y="-10" fill="#43BDAB" width="149.1" height="170"/>
            <G>
              <Path fill="#C58F75" d="M63.1,35.5l-5.6-0.3l0.1-2.8C57.7,32.2,58.5,9,43.1,6l-2.7-0.5L41.5,0l2.7,0.5c8.5,1.6,14.5,7.8,17.3,17.9
                c2.1,7.2,1.8,13.9,1.8,14.2L63.1,35.5z"/>
              <Path fill="#EF4C24" d="M83.8,25.5c-9,0-17.1,2-23.3,7.1c-6.2-5.1-14.4-7.1-23.4-7.1c-19.3,0-35,9.4-35,38.6S31,117,44.3,117
                c3.1,0,6.3-1.3,9.4-3.7c4-3.1,9.5-3.1,13.5,0c3.1,2.4,6.2,3.7,9.4,3.7c7.2,0,18.9-6.9,28.2-17.8c5.7-6.8,9.9-18.2,10.1-21.2
                c0,0-2.3-0.5-5-2.3c-3-1.9-6.1-7.3-6.6-8.1c-0.6-1.2-1.1-3.7-1.1-6c0-2,0.7-4,1.4-5.3c1.2-2.2,2.3-4,3-4.5c0.4-0.3,0,0,0,0
                c-3.4-1-7.2-3.6-9.7-5.7c-2.9-2.5-4.4-9.4-3.1-13.9c0.6-2,3.1-6,3.1-6c0.6-0.7,0,0,0,0C95.8,25.4,85.5,25.5,83.8,25.5z"/>
              <Path fill="#9FCE74" d="M64.5,29.3l-4-0.5l0.5-4c1.2-9.3,6.8-16.9,14.4-21.2c1-0.5,2-1,3-1.4c4.4-1.8,9.4-2.6,14.5-1.9l4,0.5l-0.5,4
                c-0.4,2.9-1.2,5.7-2.4,8.3c-0.4,0.9-0.9,1.8-1.4,2.7c-1.9,3.2-4.4,5.9-7.3,8.1c-1.1,0.8-2.2,1.5-3.3,2.2
                C76.8,28.8,70.7,30.1,64.5,29.3z"/>
              <Path fill="#80B054" d="M62.5,29l-2-0.3l0.3-2L75,15.8l0.4-12.2c1-0.5,2-1,3-1.4L78,13.5l16.9-13L97,0.8l-0.3,2l-11,8.4L94,13
                c-0.4,0.9-0.9,1.8-1.4,2.7l-10-2.1l-9.3,7.2l12,3c-1.1,0.8-2.2,1.5-3.3,2.2l-11.7-3L62.5,29z"/>
            </G>
            <Path fill="#CE3E27" d="M25.8,64.1c0-22.9,9.7-33.6,23.2-37.2c-3.7-1-7.7-1.4-11.8-1.4c-19.3,0-35,9.4-35,38.6S31,117,44.4,117
              c3.1,0,6.3-1.3,9.4-3.7c0.4-0.3,0.9-0.6,1.4-0.9C41.5,104.2,25.8,85.6,25.8,64.1z"/>
          </Svg>
          <Text style={ styles.logoText }>NextBite</Text>
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
            <Text style={[styles.buttonText, signInEnabled && styles.signInButtonAltText]}>
              SIGN IN
                        </Text>
          </Button >
          <View style={styles.noAccountBlock}>
            <Text style={styles.noAccount} >
              Don't have an account?
            </Text>
            <Button transparent
              style={styles.signUp}
              onPress={() => this.props.navigation.navigate('SignUp')}
            >
              <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}> Sign up now </Text>
              <Icon
                name="md-arrow-forward"
                style={{ marginLeft: 0, marginTop: 2, color: "#fff", fontSize: 16 }}
              />
            </Button>
          </View>
        </Content>
      </KeyboardAvoidingView>
    );
  }
}

const InputField = props => (
  <Item floatingLabel style={styles.inputField} >
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
    marginTop: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 4,
    elevation: 0,
    backgroundColor: 'rgba(204,204,204,0.8)',
  },
  signInButtonAlt: { //when button is enabled
    backgroundColor: '#f04c23',
  },
  buttonText: {
    fontSize: 20,
    color: 'rgba(114,115,115,0.8)',
  },
  signInButtonAltText: {
    fontSize: 20,
    color: '#fff',
  },
  noAccountBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAccount: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    alignSelf: 'center',
    color: '#247f6e'
  },
  signUp: {
    alignSelf: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: 117,
    height: 117,
    marginTop: 50,
  },
  logoText: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Light',
    fontSize: 38,
    color: '#fff'
  },
  inputField: {
    width: '80%',
    alignSelf: 'center',
    borderColor: '#247f6e'
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
    marginLeft: '12%',
    color: '#a32d21'
  }
});