import React from 'react';
import { StyleSheet, ScrollView, Button, Text } from 'react-native';
import { Icon } from 'native-base';
import { StackNavigator, NavigationActions } from 'react-navigation';

import DrawerExample from './Drawer';


export default class MarketList extends React.Component {
  state = {};

  static navigationOptions = {
    title: 'Markets with Pickups',
    headerLeft: <Icon onPress={() => this.props.navigation.navigate('DrawerOpen')} name= "menu" style={{marginLeft: 20, color: "#fff"}} size={28} />
  };

  render() {
    // basically this.props.{name}, but navigator requires this
    const { params } = this.props.navigation.state;
    const marketCards = params ? params.marketCards : null;

    return (
      
      <ScrollView style={styles.cards}>
      <Button
        onPress={() => this.props.navigation.navigate('DrawerOpen')}
        title="Go back home"
      />
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
