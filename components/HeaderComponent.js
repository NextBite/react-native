import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text } from 'native-base';

export default class HeaderComponent extends Component {
  render() {
    return (
        <Header>
          <Left>
          <Button transparent>
              <Icon 
                name='menu'
                onPress={() => {
                    const { navigate } = this.props.navigation;
                    navigate('DrawerOpen');
                }}
                />
            </Button>
          </Left>
          <Body>
            <Title style={{ marginLeft: -40 }}>{this.props.title}</Title>
          </Body>
        </Header>
    );
  }
}

