import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';

import FetchLocation from './components/FetchLocation';
import UsersMap from './components/UsersMap';
import MapCards from './components/MapCards';

export default class App extends React.Component {
  state = {
    userLocation: null,
    usersPlaces: []
  }

  // get user's current location on load of map
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0421,
        }
      });
    });
  }

  // when get location button is pressed, new location is calculated
  // plus coords are added to db
  getUserLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0421,
        }
      });

      // one argument only would send a GET request instead
      fetch('https://nextbite-f8314.firebaseio.com/places.json', {
        method: 'POST',
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
      .then(res => console.log(res))
      .catch(err => console.log(err));
    }, err => console.log(err));
  }

  getUserPlacesHandler = () => {
    fetch('https://nextbite-f8314.firebaseio.com/places.json')
    .then(res => res.json())
    .then(parsedRes => {
      const placesArray = [];
      for(const key in parsedRes) {
        placesArray.push({
          latitude: parsedRes[key].latitude,
          longitude: parsedRes[key].longitude,
          id: key
        });
      }

      this.setState({
        usersPlaces: placesArray
      });
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <UsersMap userLocation={this.state.userLocation} usersPlaces={this.state.usersPlaces} />

        <ScrollView style={styles.cards}>
          <MapCards/>
          <MapCards/>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cards: {
    width: '100%',
    height: '100%',
  }
});
