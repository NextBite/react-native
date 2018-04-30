import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

export default class usersMap extends React.Component {

  render() {
    // Create a list of <MapView.Marker /> objects for market locations. 
    let markers = this.props.markets.map((market) => {
      let pos = { latitude: market.coords.lat, longitude: market.coords.long }

      return (
        <MapView.Marker
          coordinate={pos}
          key={market.key}
          title={market.key}
        />
      );
    })

    return (
      <MapView style={styles.map}
        provider="google"
        initialRegion={this.props.userLocation}
        region={this.props.userLocation}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {markers}
      </MapView>

    );
  }
}

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
