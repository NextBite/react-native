import React, { Component } from 'react';
import firebase from 'firebase';
import HeaderComponent from './HeaderComponent';
import {
  Text, View, Image, TouchableHighlight, StyleSheet, Linking
} from 'react-native';
import { Avatar } from 'react-native-elements'
import { Button, Container, Header, Content, Tab, Tabs } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default class Profile extends Component {
  state = {
    title: "Profile",
    firstName: undefined,
    lastName: undefined,
    personType: undefined,
    mobile: undefined
  }

  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Profile';
    let drawerIcon = () => (
      <Icon
        name="person"
        style={{ color: "#44beac", }}
        size={28}
      />
    );
    return { drawerLabel, drawerIcon };
  }

  componentDidMount() {
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // user is signed in
        this.setState({ userId: user.uid })
        var profileRef = firebase.database().ref('users/' + this.state.userId);
        profileRef.once("value")
          .then(snapshot => {
            this.setState({ personType: snapshot.child("personType").val() });
            this.setState({ firstName: snapshot.child("firstName").val() });
            this.setState({ lastName: snapshot.child("lastName").val() });
            this.setState({ mobile: snapshot.child("mobile").val() });
          });
      } else {
        this.setState({ userId: null }); //null out the saved state
        this.setState({ personType: undefined }); //null out the saved state
        this.setState({ firstName: null }); //null out the saved state
        this.setState({ lastName: undefined }); //null out the saved state
        this.setState({ mobile: undefined }); //null out the saved state
      }
    });
  }

  render() {
    let first = this.state.firstName + "";
    let last = this.state.lastName + "";
    let initials = first.charAt() + last.charAt();
    let tabs = (<Tabs style={styles.tabs} tabContainerStyle={{ elevation: 0 }} tabBarUnderlineStyle={{ backgroundColor: '#f8b718' }} initialPage={0}>
      <Tab tabStyle={{ backgroundColor: '#44beac' }} textStyle={{color: '#f6f6f6'}} activeTabStyle={{ backgroundColor: '#44beac' }} heading="Ratings">
      <Text>Ratings</Text>
      </Tab>
    </Tabs>);

    return (<View style={{
      flex: 1,
      flexDirection: 'column',
    }}>
      <HeaderComponent {...this.props} title={this.state.title} />
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
      }}>
        <View style={{ paddingTop: 20, paddingBottom: 0 }}>
          <Avatar
            xlarge
            rounded
            title={initials}
            activeOpacity={0.7}
          />
        </View>
        <Text style={styles.personName}>{this.state.firstName} {this.state.lastName}</Text>
        
        <Button transparent
          style={styles.innerButton}
          onPress={() => Linking.openURL('tel:' + this.state.mobile)}
        >
          <Icon
            name="phone"
            style={{ marginLeft: 0, marginTop: 2, color: "#fff", fontSize: 24 }}
          />
          <Text style={styles.buttonText}> CONTACT</Text>
        </Button>
      </View>

      {tabs}

    </View>);
  }
}

const styles = StyleSheet.create({
  personName: {
    color: '#247f6e',
    fontFamily: 'Montserrat-Bold',
    fontSize: 36,
  },
  innerButton: {
    backgroundColor: '#44beac',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 15
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  tabs: {
    marginTop: 20,
  }
});