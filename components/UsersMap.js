import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

export default class usersMap extends React.Component {
  state = {
    userLocation: null,
  }

  // moves location dot to user's current location as they move
  componentWillMount() {
    this.setState({userLocation: this.props.userLocation})
  }

  // get's users new location upon change
  getUpdatedLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0622, // zoom/circle level
          longitudeDelta: 0.0421, // zoom/circle level
        }
      });
    });
  }

  render() {
    let userLocationMarker = null;

    // adds a marker to user's current location if the state has been set
    if (this.state.userLocation) {
      userLocationMarker = <MapView.Marker coordinate={this.state.userLocation} title="Your Location" description="desc" pinColor="#244B65" />;
    }

    const usersMarkers = this.props.usersPlaces.map(userPlace => <MapView.Marker coordinate={userPlace} key={userPlace.id} title="User's Location" description="desc" />);

    return (

        <MapView style={styles.map}
          provider="google"
          region={this.state.userLocation}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onUserLocationChange={this.getUpdatedLocation}
        >
          {userLocationMarker}
          {usersMarkers}
        </MapView>

    );
  }
}

// need absolute fill for proper viewing
const styles = StyleSheet.create({
  mapContainer: {

    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '60%'
  }
})
