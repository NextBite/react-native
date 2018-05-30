import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import HeaderComponent from './HeaderComponent';

export default class MarketList extends React.Component {
  state = { title: "Markets With Pickups" };
  render() {
    // basically this.props.{name}, but navigator requires this
    const { params } = this.props.navigation.state;
    const marketCards = params ? params.marketCards : null;

    return (
      <View style={styles.view}>
        <HeaderComponent {...this.props} title={this.state.title} />
        <ScrollView style={styles.cards}>
          {marketCards}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cards: {
    width: '100%',
    height: '100%',
  }, 
  view: {
    marginBottom: 56,
  }
});
