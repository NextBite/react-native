import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import firebase from 'firebase';

import MarketCards from './MarketCards';
import MarketTitleCard from './MarketTitleCard';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class MarketPickups extends React.Component {
  state = {};

  static navigationOptions = {
    title: 'Market Details',
    headerLeft: <Icon onPress={() => props.navigation.navigate('DrawerOpen')} name= "menu" style={{marginLeft: 20}} size={28} color="#ffffff" />
  };

  componentDidMount() {
    // basically this.props.{name}, but navigator requires this
    const { params } = this.props.navigation.state;
    const marketName = params ? params.marketName : null;
    this.setState({marketName: marketName});

    let marketPickups = [];
    let currentMarketCards = [];

    // query the pickup listings within a particular market
    let marketRef = firebase.database().ref(`markets/${marketName}`);
    marketRef.on('value', (snapshot) => {
      snapshot.forEach(function (child) {
        let pickupObj = child.val();

        // this ensures that the coords of the market aren't added to
        // the cards
        if(!(pickupObj.lat != null)) {
          marketPickups.push(pickupObj.listingId);
        }
      })

      this.setState({ pickups: marketPickups });

      // query for all pickup listing details
      let pickups = marketPickups.map((pickup) => {
        let listingsRef = firebase.database().ref(`listings/${pickup}`);
        listingsRef.on('value', (snapshot) => {
          let pickupsObj = {};
          snapshot.forEach(function (child) {
            pickupsObj[child.key] = child.val();
          });

          // retrieve vendor's name for the listing
          let usersRef = firebase.database().ref(`users/${pickupsObj.userId}`);
          usersRef.on('value', (snapshot) => {
            let vendor = "";
            snapshot.forEach(function (child) {
              if (child.key == "vendorName") {
                vendor = child.val();
              }
            });

            currentMarketCards.push(<MarketCards
              boxes={pickupsObj.boxes}
              vendor={vendor}
              expiration={pickupsObj.expirationDate}
              weight={pickupsObj.weight}
              tags={pickupsObj.tags}
              listingId={pickup}
              key={pickup}
              navigation={this.props.navigation}
            />);

            this.setState({ marketCards: currentMarketCards })
          });
        });
      });
    });
  }

  render() {
    return (
      <View>
        <ScrollView style={styles.cards}>
        <MarketTitleCard
          marketName={this.state.marketName}
        />
          {this.state.marketCards}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cards: {
    width: '100%',
    height: '100%',
  }
});
