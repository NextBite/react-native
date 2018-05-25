import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TimePickerAndroid, TimePickerAndroidOpenOptions } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Left, Right } from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from "react-native-vector-icons/FontAwesome";

export default class ListingsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: undefined,
      boxes: undefined,
      expirationDate: undefined,
      weight: undefined,
      tags: undefined,
      isTimePickerVisible: false,
      claimed: "no",
      claimedBy: "",
      delivered: "no",
      dropoffLocation: ""
    }
  };


  /**
   * A helper function to validate a value based on a hash of validations
   * second parameter has format e.g.,
   * {required: true, minLength: 5, email: true}
   * (for required field, with min length of 5, and valid email)
   */
  validate(value, validations) {
    let errors = { isValid: true };

    if (value === undefined) { //check validations
      //display name required
      if (validations.required) {
        errors.required = true;
        errors.isValid = false;
      }
    }

    return errors; //return data object
  }

  showTimePicker = () => this.setState({ isTimePickerVisible: true });

  hideTimePicker = () => this.setState({ isTimePickerVisible: false });

  handleTimePicked = (date) => {
    this.setState({ expirationDate: date })
    this.hideTimePicker();
  };

  showTimePicked = () => {
    if (this.state.expirationDate === undefined) {
      return (
        <Text style={styles.timepickertxt}>Latest pickup time today</Text>
      );
    } else {
      // render a more readable time
      let datetime = this.state.expirationDate.toString().slice(0, -18).split(" ");
      let hour = datetime[4].split(":")[0];
      if (parseInt(hour) > 0 && parseInt(hour) < 12) {
        datetime[4] = datetime[4] + " AM";
      } else if (parseInt(hour) > 12) {
        datetime[4] = (parseInt(hour) - 12).toString() + ":" + datetime[4].split(":")[1] + " PM";
      } else if (parseInt(hour) === 12) {
        datetime[4] = datetime[4] + " PM";
      } else if (parseInt(hour) === 0) {
        datetime[4] = "12:" + datetime[4].split(":")[1] + " AM";
      }
      let displayedTime = datetime[0] + " " + datetime[1] + " " + datetime[2] + ", " + datetime[4];

      return (
        <Text style={styles.timepickertxtAlt}>{displayedTime}</Text>
      );
    }
  }

  //handle submit button
  submit() {
    this.props.submitCallback(this.state.location, this.state.boxes, this.state.expirationDate, this.state.weight, this.state.tags, this.state.claimed, this.state.claimedBy, this.state.delivered, this.state.dropoffLocation);
    this.props.navigation.navigate('PendingDonations');
  }

  render() {
    //field validation
    let locationErrors = this.validate(this.state.location, { required: true });
    let boxesErrors = this.validate(this.state.boxes, { required: true });
    let weightErrors = this.validate(this.state.weight, { required: true });
    let tagErrors = this.validate(this.state.tags, { required: true });
    let expirationErrors = this.validate(this.state.expirationDate, { required: true });
    let submitEnabled = (locationErrors.isValid && boxesErrors.isValid && weightErrors.isValid && tagErrors.isValid && expirationErrors.isValid)

    let markets = [
      {
        label: 'Ballard Farmers Market',
        value: 'Ballard Farmers Market, 47.6450099, -122.3486234'
      },
      {
        label: 'Capitol Hill Farmers Market',
        value: 'Capitol Hill Farmers Market, 47.6163942, -122.3231928'
      },
      {
        label: 'City Hall Farmers Market',
        value: 'City Hall Farmers Market, 47.6097185, -122.3597025'
      },
      {
        label: 'Columbia City Farmers Market',
        value: 'Columbia City Farmers Market, 47.5663073, -122.3465634'
      },
      {
        label: 'Denny Regrade Farmers Market',
        value: 'Denny Regrade Farmers Market, 47.6097158, -122.3597025'
      },
      {
        label: 'Fremont Farmers Market',
        value: 'Fremont Farmers Market, 47.6463977, -122.3474217,13'
      },
      {
        label: 'Lake City Farmers Market',
        value: 'Lake City Farmers Market, 47.71992, -122.3003247'
      },
      {
        label: 'Madrona Farmers Market',
        value: 'Madrona Farmers Market, 47.612343, -122.2977045'
      },
      {
        label: 'Magnolia Farmers Market',
        value: 'Magnolia Farmers Market, 47.646629, -122.363557'
      },
      {
        label: 'Phinney Farmers Market',
        value: 'Phinney Farmers Market, 47.67763, -122.3562657'
      },
      {
        label: 'Pike Place Market',
        value: 'Pike Place Market, 47.6097199, -122.3465703'
      },
      {
        label: 'Queen Anne Farmers Market',
        value: 'Queen Anne Farmers Market, 47.637149, -122.3592802'
      },
      {
        label: 'Rainier Farmers Market',
        value: 'Rainier Farmers Market, 47.5663073,-122.3465634'
      },
      {
        label: 'South Lake Union Farmers Market',
        value: 'South Lake Union Farmers Market, 47.6040411, -122.3366638'
      },
      {
        label: 'University District Farmers Market',
        value: 'University District Farmers Market, 47.6656392, -122.3152575'
      },
      {
        label: 'Wallingford Farmers Market',
        value: 'Wallingford Farmers Market, 47.6623941, -122.3407796'
      },
      {
        label: 'West Seattle Farmers Market',
        value: 'West Seattle Farmers Market, 47.5612161, -122.3887488'
      }
    ]

    let boxWeight = [
      {
        label: '< 1 lbs',
        value: '< 1 lbs'
      },
      {
        label: '1-5 lbs',
        value: '1-5 lbs'
      },
      {
        label: '6-10 lbs',
        value: '6-10 lbs'
      },
      {
        label: '> 10 lbs',
        value: '> 10 lbs'
      }
    ]

    let numBox = [
      {
        label: '1',
        value: 1
      },
      {
        label: '2',
        value: 2
      },
      {
        label: '3',
        value: 3
      },
      {
        label: '4',
        value: 4
      },
      {
        label: '5',
        value: 5
      },
      {
        label: '6',
        value: 6
      },
      {
        label: '7',
        value: 7
      },
      {
        label: '8',
        value: 8
      },
      {
        label: '9',
        value: 9
      },
      {
        label: '10',
        value: 10
      }
    ]

    let tags = [
      {
        label: "Fruits only",
        value: "Fruits only"
      },
      {
        label: "Vegetables only",
        value: "Vegetables only"
      },
      {
        label: "Fruits and Vegetables",
        value: "Fruits and Vegetables"
      }
    ]

    return (
      <Container style={{alignSelf: 'center', width: '100%', backgroundColor: '#f6f6f6'}}>
        <Content>
        <Text style={{ alignSelf: 'center', fontSize: 16, marginTop: 20 }}>What would you like to donate today?</Text>
          <View style={styles.view}>
            <Left style={styles.left}>
              <Icon name="map-marker" style={styles.icon} />
            </Left>
            <Right style={styles.right} >
              <RNPickerSelect
                placeholder={{
                  label: 'Your Market Location',
                  value: null,
                }}
                items={markets}
                onValueChange={(value) => this.setState({ location: value })}
                value={this.state.location}
                style={{ ...pickerSelectStyles }}
              />
            </Right>
          </View>
          <View style={styles.view}>
            <Left style={styles.left}>
              <Icon name="cube" style={styles.icon} />
            </Left>
            <Right style={styles.right} >
              <RNPickerSelect
                placeholder={{
                  label: 'Number of Boxes',
                  value: null
                }}
                items={numBox}
                onValueChange={(value) => this.setState({ boxes: value })}
                value={this.state.boxes}
                style={{ ...pickerSelectStyles }}
              />
            </Right>
          </View>
          <View style={styles.view}>
            <Left style={styles.left}>
              <Icon name="balance-scale" style={styles.iconscale} />
            </Left>
            <Right style={styles.right}>
              <RNPickerSelect
                placeholder={{
                  label: 'Weight of Boxes',
                  value: null,
                }}
                items={boxWeight}
                onValueChange={(value) => this.setState({ weight: value })}
                value={this.state.weight}
                style={{ ...pickerSelectStyles }}
              />
            </Right>
          </View>
          <View style={styles.view}>
            <Left style={styles.left}>
              <Icon name="tags" style={styles.icon} />
            </Left>
            <Right style={styles.right} >
              <RNPickerSelect
                placeholder={{
                  label: 'Types of Food',
                  value: null
                }}
                items={tags}
                onValueChange={(value) => this.setState({ tags: value })}
                value={this.state.tags}
                style={{ ...pickerSelectStyles }}
              />
            </Right>
          </View>
          <View style={styles.view}>
            <Left style={styles.left}>
              <Icon name="hourglass-start" style={styles.icon} />
            </Left>
            <Right style={styles.right}>
              <Button transparent
                style={styles.timepickerbtn}
                onPress={this.showTimePicker}
              >
                {this.showTimePicked()}
                <Icon name='caret-down' style={styles.timepickericon} />
              </Button>
            </Right>
          </View>
          <DateTimePicker
            isVisible={this.state.isTimePickerVisible}
            onConfirm={this.handleTimePicked}
            onCancel={this.hideTimePicker}
            mode='time'
            style={{ marginBottom: 0 }}
          />
          <Button
            style={[styles.submitBtn, submitEnabled && styles.submitBtnAlt]}
            onPress={() => this.submit()}
            disabled={!submitEnabled}
          >
            <Text style={[styles.buttonText, submitEnabled && styles.buttonAltText]}>SUBMIT</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    alignItems: 'center',
    width: '92%'
  },
  icon: {
    fontSize: 36,
    color: "#247f6e",
    alignSelf: 'center',
  },
  iconscale: {
    fontSize: 36,
    color: "#247f6e",
    alignSelf: 'center',
    paddingLeft: '10%',
  },
  timepickerbtn: {
    width: '88%',
    marginRight: '10%',
    borderBottomWidth: 0.5,
    borderColor: '#333333',
    alignSelf: 'flex-end'
  },
  timepickertxt: {
    width: '90%',
    fontSize: 16,
    color: '#C7C6CC'
  },
  timepickertxtAlt: { // when time is picked
    width: '90%',
    fontSize: 16,
    color: '#333333'
  },
  timepickericon: {
    marginRight: 30,
    fontSize: 16
  },
  submitBtn: {
    width: '70%',
    marginTop: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 4,
    elevation: 0,
    backgroundColor: 'rgba(204,204,204,0.8)',
    marginBottom: 20,
  },
  submitBtnAlt: { // when button is enabled
    backgroundColor: '#44beac'
  },
  buttonText: {
    fontSize: 20,
    color: 'rgba(114,115,115,0.8)',
  },
  buttonAltText: {
    fontSize: 20,
    color: '#fff',
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 3,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    alignItems: 'flex-start',
  },
  viewContainer: {
    width: '100%',
    alignSelf: 'flex-start',
    borderColor: '#247f6e',
    marginRight: '10%',
  },
  underline: {
    borderColor: '#247f6e',
    opacity: 1,
    borderTopWidth: 0.5
  },
});