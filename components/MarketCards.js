import React from 'react';
import { StyleSheet, Image, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

export default class MarketCards extends React.Component {
  constructor(props) {
    super(props);

    this.openAlert = this.openAlert.bind(this);
  }

  openAlert() {
    Alert.alert(
      'Rescue Confirmation',
      `Are you sure you want to claim this rescue?`,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes', onPress: () => this.props.navigation.navigate('DropOffLocation', { location: this.props.marketId, listingId: this.props.listingId, marketId: this.props.marketId }) },
      ],
      { cancelable: false }
    )
  }

  render() {
    console.log("market id", this.props.marketId);
    return (
      <Card style={styles.card}>
        <CardItem>
          <Left>
            <Body>
              <Text style={styles.vendorName}>{this.props.vendor}</Text>
              <Text note style={styles.subText}>{String(new Date(this.props.expiration)).slice(0, -18)}</Text>
              <Text style={styles.regText}>
                This rescue has {this.props.boxes} boxes and weighs {this.props.weight}.
              </Text>
              <Text style={styles.tags}>
                Contains: {this.props.tags}
              </Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent
              style={styles.innerButton}
              onPress={() => this.openAlert()}
            >
              <Text style={styles.buttonText}>Claim</Text>
            </Button>
          </Left>
        </CardItem>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
    marginTop: 0
  },
  subText: {
    paddingBottom: 10,
  },
  regText: {
    fontSize: 14,
  },
  tags: {
    fontSize: 14,
  },
  innerButton: {
    backgroundColor: '#44beac',
    alignSelf: 'center',
    alignItems: 'center',
    paddingRight: 0,
    marginLeft: 8
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  vendorName: {
    color: '#247f6e',
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
  }
});
