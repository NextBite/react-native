import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import firebase from 'firebase';

import MapCards from './MapCards';

export default class usersMap extends React.Component {
  render() {
    // Create a list of <MapView.Marker /> objects for market locations. 
    /*let markers = this.props.markets.map((market) => {
      let pos = { latitude: market.coords.lat, longitude: market.coords.long }

      return (
        <MapView.Marker
          coordinate={pos}
          key={market.key}
          title={market.key}
        />
      );
    })*/

    return (
      <View style={styles.mapContainer}>
      <MapView style={styles.map}
        provider="google"
        initialRegion={this.props.userLocation}
        region={this.props.userLocation}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {this.props.markers}
      </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  map: {
    width: '100%',
    height: '100%'
  }
})
