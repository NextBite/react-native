import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class SuccessfulClaim extends React.Component {
  state = {};

  static navigationOptions = {
    title: 'Successful Claim',
  };

  componentWillMount() {


  }

  render() {
    const { params } = this.props.navigation.state;
    const nonprofit = params ? params.nonprofit : null;
    const coords = params ? params.coords : null;

    console.log("non", nonprofit)
    console.log("coords", coords)

    return (
      <View style={styles.container}>
        <Image
          style={{width: '100%', height: '50%'}}
          source={{uri: `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.long}&zoom=16&size=400x400&scale=2&maptype=roadmap&markers=color:red|label:S|${coords.lat},${coords.long}&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE`}}
        />
        <Text>You're delivering this box of donations to {nonprofit}!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
});
