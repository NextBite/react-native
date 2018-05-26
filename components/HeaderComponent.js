import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text } from 'native-base';

export default class HeaderComponent extends Component {
  render() {
    return (
        <Header style={{backgroundColor: '#44beac'}} androidStatusBarColor='#35a08e'>
          <Left>
          <Button transparent style={{width: 50,}}>
              <Icon 
                name='menu'
                onPress={() => {
                    const { navigate } = this.props.navigation;
                    navigate('DrawerOpen');
                }}
                style={{ fontSize: 30, }}
                />
            </Button>
          </Left>
          <Body>
            <Title style={{ marginLeft: -40, fontWeight: 'bold', fontSize: 18 }}>{this.props.title}</Title>
          </Body>
        </Header>
    );
  }
}

