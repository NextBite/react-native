import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

export default class MarketList extends React.Component {
  state = {};

  static navigationOptions = {
    title: 'Markets with Pickups',
  };

  render() {
    // basically this.props.{name}, but navigator requires this
    const { params } = this.props.navigation.state;
    const marketCards = params ? params.marketCards : null;

    return (
      <ScrollView style={styles.cards}>
        {marketCards}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cards: {
    width: '100%',
    height: '100%',
  }
});
