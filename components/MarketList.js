import React from 'react';
import { StyleSheet, ScrollView, Button, Text } from 'react-native';
import { Icon } from 'native-base';
import { StackNavigator, NavigationActions } from 'react-navigation';


export default class MarketList extends React.Component {
  state = {};

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
