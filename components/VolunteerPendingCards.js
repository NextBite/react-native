import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

export default class VolunteerPendingCards extends React.Component {
  render() {
    return (
      <Card style={styles.card}>
        <CardItem>
          <Left>
            <Body>
              <Text>{this.props.vendor}</Text>
              <Text note style={styles.subText}>{String(new Date(this.props.expiration)).slice(0, -18)}</Text>
              <Text style={styles.regText}>
                This pickup has {this.props.boxes} boxes and weighs {this.props.weight}.
              </Text>
              <Text style={styles.regText}>
                Contains: {this.props.tags}
              </Text>
              <Text style={styles.regText}>
                This rescue is being delivered to {this.props.dropoffLocation.name}.
              </Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent
              style={styles.innerButton}
              onPress={() => this.props.navigation.navigate('', {})}
            >
              <Text style={styles.buttonText}>Contact Vendor</Text>
            </Button>
            <Button transparent
              style={styles.innerButton}
              onPress={() => this.props.navigation.navigate('', {})}
            >
              <Text style={styles.buttonText}>Deliver</Text>
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
});
