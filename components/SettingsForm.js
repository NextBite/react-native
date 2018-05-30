import React, { Component } from 'react';
import firebase from 'firebase';
import HeaderComponent from './HeaderComponent';
import {
  Text, View, Image, TouchableHighlight, StyleSheet, Linking, Alert, KeyboardAvoidingView
} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, } from 'native-base';


export default class SettingsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      vendorName: undefined,
      personType: undefined,
      mobile: undefined,
      spinnerDisplay: false,
      password: this.props.password
    }
  }


  //Lifecycle callback executed when the component appears on the screen.
  //Sets the initial state of the logged in user so they can edit their profile information
  componentDidMount() {
    // Add a listener and callback for authentication events
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        this.setState({ userId: user.uid });
        var profileRef = firebase.database().ref('users/' + this.state.userId);
        profileRef.once("value")
          .then(snapshot => {
            this.setState({ firstName: snapshot.child("firstName").val() });
            this.setState({ lastName: snapshot.child("lastName").val() });
            this.setState({ vendorName: snapshot.child("vendorName").val() });
            this.setState({ mobile: snapshot.child("mobile").val() });
            this.setState({ email: snapshot.child("email").val() });
            this.setState({ personType: snapshot.child("personType").val() });
          });
      } else {
        const path = '/signin'; //redirect to signin page if user is not logged in
        this.props.history.push(path);
        this.setState({ userId: null }); //null out the saved state
        this.setState({ firstName: null }); //null out the saved state
        this.setState({ lastName: null }); //null out the saved state
        this.setState({ vendorName: null }); //null out the saved state
        this.setState({ mobile: null }); //null out the saved state
        this.setState({ email: null }); //null out the saved state
        this.setState({ personType: null }); //null out the saved state*/
        this.setState({ password: null }); //null out the saved state
      }
    });
  }

  //when component will be removed
  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('users/' + this.state.userId).off();
    if (this.unregister) { //if have a function to unregister with
      this.unregister(); //call that function!
    }
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
        //http://emailregex.com/ 
        let valid = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/.test(value);
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

    if (!errors.isValid) { //if found errors
    } else if (value !== undefined) { //valid and has input
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
    }
    return null
  }

  // handle sign in button
  submit() {
    Alert.alert(
      'Settings Confirmation',
      `Are you sure you want to update your settings?`,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Okay', onPress: () => this.submitInfo() },
      ],
      { cancelable: false }
    )
  }

  submitInfo() {
    this.setState({ spinnerDisplay: true }); //show loading spinner while user submits form

    let user = firebase.auth().currentUser; //grabs the logged in user's' info

    let userRef = firebase.database().ref('users/' + user.uid); //finds the logged in user in the database
    userRef.child('firstName').set(this.state.firstName); //sets their first name
    userRef.child('lastName').set(this.state.lastName); //sets their last name
    userRef.child('vendorName').set(this.state.vendorName); //sets their vendor name 
    userRef.child('mobile').set(this.state.mobile); //sets their avatar
    userRef.child('email').set(this.state.email); //sets their email*/


    user.updateEmail(this.state.email)
      .catch(function (error) {
      });

    user.updatePassword(this.state.password)
      .catch(function (error) {
      });

      this.props.navigation.navigate('MarketMap');
  }

  render() {
    let emailErrors = this.validate(this.state.email, { required: true, email: true });
    let passwordErrors = this.validate(this.state.password, { required: true, minLength: 8 });
    let firstNameErrors = this.validate(this.state.firstName, { required: true, minLength: 1 });
    let lastNameErrors = this.validate(this.state.lastName, { required: true, minLength: 1 });
    let mobileErrors = this.validate(this.state.mobile, { required: true, phone: true });
    let passwordConfirmErrors = this.validate(this.state.password, { required: true, match: true });
    let vendorNameErrors = this.validate(this.state.vendorName, { required: true, minLength: 1 });

    //button validation
    let saveSettings = false;
    if(this.state.personType === 'volunteer') {
      saveSettings = (emailErrors.isValid && passwordErrors.isValid && passwordConfirmErrors.isValid && firstNameErrors.isValid && lastNameErrors.isValid && mobileErrors.isValid);
    } else {
      saveSettings = (emailErrors.isValid && passwordErrors.isValid && passwordConfirmErrors.isValid && firstNameErrors.isValid && lastNameErrors.isValid && mobileErrors.isValid && vendorNameErrors.isValid);
    }

    let vendorName = null;

    if (this.state.personType === 'vendor') {
      <InputField
        label='Vendor Name'
        keyboard='default'
        handleChange={(text) => this.setState({ vendorName: text })}
        secure={false}
        value={this.state.vendorName}
      />
      { this.renderErrorMsg(vendorNameErrors) }
    }

    return (
      <KeyboardAvoidingView style={styles.container} >
        <Content>
          <View style={styles.messageView}>
            <Text style={styles.messageText}>You must input your password before making any changes.</Text>
          </View>
          <Form>
            <InputField
              label='First Name'
              keyboard='default'
              handleChange={(text) => this.setState({ firstName: text })}
              secure={false}
              value={this.state.firstName}
            />
            {this.renderErrorMsg(firstNameErrors)}
            <InputField
              label='Last Name'
              keyboard='default'
              handleChange={(text) => this.setState({ lastName: text })}
              secure={false}
              value={this.state.lastName}
            />
            {this.renderErrorMsg(lastNameErrors)}
            <InputField
              label='Email'
              keyboard='email-address'
              handleChange={(text) => this.setState({ email: text })}
              value={this.state.email}
              secure={false}
            />
            {this.renderErrorMsg(emailErrors)}
            <InputField
              label='Mobile Number'
              keyboard='phone-pad'
              handleChange={(text) => this.setState({ mobile: text })}
              secure={false}
              value={this.state.mobile}
            />
            {this.renderErrorMsg(mobileErrors)}
            {vendorName}
            <InputField
              label='Password'
              keyboard='default'
              handleChange={(text) => this.setState({ password: text })}
              secure={true}
              value={this.state.password}
            />
            {this.renderErrorMsg(passwordErrors)}
            <InputField
              label='Confirm Password'
              keyboard='default'
              handleChange={(text) => this.setState({ passwordConfirm: text })}
              secure={true}
            />
            {this.renderErrorMsg(passwordConfirmErrors)}
          </Form>

          <Button
            style={[styles.saveButton, saveSettings && styles.saveButtonAlt]}
            onPress={() => this.submit()}
            disabled={!saveSettings}
          >
            <Text style={[styles.buttonText, saveSettings && styles.saveButtonAltText]}>
              SAVE SETTINGS</Text>
          </Button >
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
      value={props.value}
    />
  </Item>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6'
  },
  saveButton: {
    width: '70%',
    marginTop: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 4,
    elevation: 0,
    backgroundColor: 'rgba(204,204,204,0.8)',
  },
  saveButtonAlt: { //when button is enabled
    backgroundColor: '#44beac',
  },
  buttonText: {
    fontSize: 20,
    color: 'rgba(114,115,115,0.8)',
  },
  saveButtonAltText: {
    fontSize: 20,
    color: '#fff',
  },
  inputField: {
    width: '80%',
    marginRight: '4%',
    alignSelf: 'center',
    borderColor: '#247f6e'
  },
  input: {
    color: '#474748'
  },
  inputLabel: {
    fontSize: 16,
    color: '#247f6e'
  },
  errorText: {
    fontSize: 16,
    marginLeft: '11%',
    color: '#96372d',
    fontWeight: 'bold',
  },
  messageView: {
    alignSelf: 'center',
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
    fontSize: 16,
    marginBottom: 10,
  },
});