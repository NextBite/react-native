import React from 'react';
import { StyleSheet, View, } from 'react-native';
import firebase from 'firebase';

import Icon from 'react-native-vector-icons/MaterialIcons';

import SignIn from './SignIn';

export default class SignOut extends React.Component {
  constructor(props){
		super(props);
    this.state = {};
  }
  
  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Sign Out';
    let drawerIcon = () => (
      <Icon
        name="exit-to-app"
        style={{ color: "#44beac" }}
        size={28}
      />
    );
    return { drawerLabel, drawerIcon };
  }

  //Lifecycle callback executed when the component appears on the screen.
	componentDidMount() {
    // Add a listener and callback for authentication events 
    const {navigate} = this.props.navigation;
    firebase.auth().signOut();

		this.unregister = firebase.auth().onAuthStateChanged(user => {
			if(user) {
				this.setState({userId:user.uid}); //grabs user id
			} else { //redirects to home page once logged out
				this.setState({userId: null}); //null out the saved state
			}
    });
    
    navigate('SignIn', { signedOut: true })
  }

	//when component will be removed
  componentWillUnmount() {
    if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }

  render() {
    return (
      <View>
      </View>
    )
  }
}