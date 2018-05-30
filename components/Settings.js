import React, { Component } from 'react';
import firebase from 'firebase';
import HeaderComponent from './HeaderComponent';
import {
  Text, View, Image, TouchableHighlight, StyleSheet, Linking,
} from 'react-native';
import { Avatar } from 'react-native-elements'
import { Button, Container, Header, Content, Spinner, Form, Item, Input, Label, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SettingsForm from './SettingsForm';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      showToast: false,
      spinnerDisplay: false,
      title: "Settings",
      auth: false
    }
    this.signIn = this.signIn.bind(this);
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
      console.log("hi")
    });
  }

  componentWillUnmount() {
    if (this.unregister) {
      this.unregister();
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

      // handle password confirmation
      if (validations.match) {
        if (this.state.password !== this.state.passwordConfirm) {
          errors.match = true;
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

  //A callback function for logging in existing users
  signIn(password) {
    let thisComponent = this;
    thisComponent.setState({ spinnerDisplay: true }); //show spinner while user is logging in
    thisComponent.setState({ isSnackbarActive: true }); //show snackbar that contains spinner while user is logging in

    firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, password)).then(function () {

      // Sign in the user 
      //firebase.auth().signInWithEmailAndPassword(firebase.auth().currentUser.email, password) //logs in user with email and password
      //.then(function () {
      thisComponent.setState({ auth: true });
      thisComponent.setState({ password: password });
      thisComponent.setState({ showToast: false });
      thisComponent.setState({ spinnerDisplay: false }); //don't show spinner with error message
      thisComponent.setState({ error: null }); //put error message in state
    })
      .catch(function (error) { //displays an error if there is a mistake with logging a user in
        let errorMessage = error.message;
        thisComponent.setState({ spinnerDisplay: false }); //don't show spinner with error message
        thisComponent.setState({ error: errorMessage }); //put error message in state
        thisComponent.setState({ showToast: true }); //pop up snackbar to contain error message
      });
  }

  render() {
    let spinner = null;
    if (this.state.spinnerDisplay) {
      spinner = (<View style={{ backgroundColor: 'rgba(0,0,0,0.9)', height: 80, }}><Spinner color="#44beac" />
      </View>)
    }

    let toast = null;
    if(this.state.showToast) {
        toast = Toast.show({
            text: this.state.error,
            buttonText: 'Okay',
            duration: 3000
        })
    }

    let passwordErrors = this.validate(this.state.password, { required: true, minLength: 8 });
    let passwordConfirmErrors = this.validate(this.state.password, { required: true, match: true });

    console.log("APAOSOSO")
    console.log(this.state.password)
    console.log(this.state.passwordConfirm)
    //button validation
    let signInEnabled = (passwordErrors.isValid && passwordConfirmErrors.isValid);

    let setting = null;

    if (this.state.auth) {
      setting = (<SettingsForm password={this.state.password} navigation={this.props.navigation}/>);
    } else {
      setting = (
        <Content>
          <View style={styles.messageView}>
            <Text style={styles.messageText}>You must re-login before making changes to your settings.</Text>
          </View>
          <Form>
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
          </Form>
          <Button
            style={[styles.saveButton, signInEnabled && styles.saveButtonAlt]}
            onPress={() => this.signIn(this.state.password)}
            disabled={!signInEnabled}
          >
            <Text style={[styles.buttonText, signInEnabled && styles.saveButtonAltText]}>
              SIGN IN</Text>
          </Button >
        </Content>
      );
    }

    return (
      <Container>
        <HeaderComponent {...this.props} title={this.state.title} />
        {setting}
        {spinner}
        {toast}
      </Container>
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