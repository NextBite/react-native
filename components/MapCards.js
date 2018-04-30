import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

export default class MapCards extends React.Component {

    render() {
        return (
            <Card style={styles.card}>
                <CardItem>
                    <Left>
                        <Body>
                            <Text>NativeBase</Text>
                            <Text note style={styles.subText}>GeekyAnts</Text>
                            <Text style={styles.regText}>
                  //Your text here
                </Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent>
                            <Text>Pickups</Text>
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
    }
});
