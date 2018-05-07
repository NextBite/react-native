import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Icon } from 'native-base';

export default class MarketList extends React.Component {
  state = {};

  static navigationOptions = {
    title: 'Markets with Pickups',
    headerLeft: <Icon onPress={() => props.navigation.navigate('DrawerOpen')} name= "menu" style={{marginLeft: 20}} size={28} color="#ffffff" />
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
