import React from 'react';
import { StyleSheet, View, ScrollView, Button, Text } from 'react-native';
import { Icon } from 'native-base';
import { StackNavigator, NavigationActions } from 'react-navigation';

import HeaderComponent from './HeaderComponent';


export default class MarketList extends React.Component {
  state = { title: "Market List" };

  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Market List';
    let drawerIcon = () => (
      <Icon
        name="menu"
        style={{ marginLeft: 20, color: "#fff", backgroundColor: '#44beac' }}
        size={28}
      />
    );
    
    return { drawerLabel, drawerIcon };
  }

  render() {
    // basically this.props.{name}, but navigator requires this
    const { params } = this.props.navigation.state;
    const marketCards = params ? params.marketCards : null;
    console.log("props", this.props)
    return (
      <View>
        <HeaderComponent {...this.props} title={this.state.title} />
        <ScrollView style={styles.cards}>
          <Button
            onPress={() => this.props.navigation.navigate('DrawerOpen')}
            title="Go back home"
          />
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
  }
});
