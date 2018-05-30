import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TimePickerAndroid, TimePickerAndroidOpenOptions, TouchableOpacity, } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Left, Right } from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from "react-native-vector-icons/FontAwesome";
import Autocomplete from 'react-native-autocomplete-input';


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
      dropoffLocation: "",
      markets: [],
      query: '',
    }
  };

  componentDidMount() {
    let marketList = [
      {
          label: 'Ballard Farmers Market',
          value: 'Ballard Farmers Market, 47.6450099, -122.3868226'
      },
      {
          label: 'Capitol Hill Farmers Market',
          value: 'Capitol Hill Farmers Market, 47.616384, -122.3230037'
      },
      {
          label: 'City Hall Farmers Market',
          value: 'City Hall Farmers Market, 47.6061071, -122.3396986'
      },
      {
          label: 'Columbia City Farmers Market',
          value: 'Columbia City Farmers Market, 47.558659, -122.2884737'
      },
      {
          label: 'Denny Regrade Farmers Market',
          value: 'Denny Regrade Farmers Market, 47.6162035, -122.3415552'
      },
      {
          label: 'Fremont Sunday Flea Market',
          value: 'Fremont Sunday Flea Market, 47.6500674, -122.3538378'
      },
      {
          label: 'Lake City Farmers Market',
          value: 'Lake City Farmers Market, 47.71992, -122.3003247'
      },
      {
          label: 'Madrona Farmers Market',
          value: 'Madrona Farmers Market, 47.6123567, -122.2977639'
      },
      {
          label: 'Magnolia Farmers Market',
          value: 'Magnolia Farmers Market, 47.6395485, -122.4011365'
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
          value: 'Rainier Farmers Market, 47.5838187, -122.3376951'
      },
      {
          label: 'South Lake Union Saturday Market',
          value: 'South Lake Union Farmers Market, 47.6136002, -122.3445845'
      },
      {
          label: 'University District Farmers Market',
          value: 'University District Farmers Market, 47.6656392, -122.3152575'
      },
      {
          label: 'Wallingford Farmers Market',
          value: 'Wallingford Farmers Market, 47.6638266, -122.3350488'
      },
      {
          label: 'West Seattle Farmers Market',
          value: 'West Seattle Farmers Market, 47.5612161, -122.3887488'
      }
  ]

    this.setState({ markets: marketList });
  }


  /**
   * A helper function to validate a value based on a hash of validations
   * second parameter has format e.g.,
   * {required: true, minLength: 5, email: true}
   * (for required field, with min length of 5, and valid email)
   */
  validate(value, validations) {
    let errors = { isValid: true, matchGood: false };

    console.log("VALUE", value)
    console.log("VALIDATIONS", validations)
    if (value === null) { //check validations
      //display name required
      if (validations.required) {
        errors.required = true;
        errors.isValid = false;
      }
    } else if (value !== null) {
      if (validations.time) {
        if (value < Date.now()) {
          errors.time = true;
          errors.isValid = false;
        }
      }
    } 
    
    if (value !== undefined) {
      console.log("HELLO!");
      if (validations.required && value === '') {
        errors.required = true;
        errors.isValid = false;
      }

      if(validations.numbers && value != '') {
        let valid = /^[0-9]+$/.test(value)
        if (!valid) {
          errors.numbers = true;
          errors.isValid = false;
        }
      }

      if(validations.match) {
        this.state.markets.forEach(function(market) {
          //console.log("MARKET", market);
          if(value.toLowerCase() === market.label.toLowerCase()) {
            errors.matchGood = true;
          }
          errors.match = true;
        });
      }
    }

    if (!errors.isValid) { //if found errors
    } else if (value !== undefined) { //valid and has input
    } else { //valid and no input
      errors.isValid = false; //make false anyway
    }

    return errors; //return data object
  }

  /* A helper function that renders the appropriate error message */
  renderErrorMsg(error) {
    if (error.time) {
      return <Text style={styles.errorText}>The expiration time must be after {this.readableTime(Date.now())}.</Text>
    } else if (!error.matchGood && error.match) {
      return <Text style={styles.errorTextNearby}>Your input does not match any nearby markets.</Text>
    } else if (error.numbers) {
      return <Text style={styles.errorText}>Must contain only numbers.</Text>
    } else if (error.required) {
      return <Text style={styles.errorText}>This field is required.</Text>
    }
    return null
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


      return (
        <Text style={styles.timepickertxtAlt}>{this.readableTime()}</Text>
      );
    }
  }

  readableTime() {
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
    return displayedTime = datetime[0] + " " + datetime[1] + " " + datetime[2] + ", " + datetime[4];
  }

  //handle submit button
  submit() {
    this.props.submitCallback(this.state.location, this.state.boxes, this.state.expirationDate, this.state.weight, this.state.tags, this.state.claimed, this.state.claimedBy, this.state.delivered, this.state.dropoffLocation);
    this.props.navigation.navigate('PendingDonations');
  }

  findMarket(query) {
    if (query === '') {
      return [];
    }

    if (!query.includes('\\') && !query.includes('(') && !query.includes('[')) {
      const regex = new RegExp(`${query.trim()}`, 'i');
      return this.state.markets.filter(market => market.label.search(regex) >= 0);
    } else {
      return [];
    }
  }

  camelCase(text) {
    let splitText = text.split(" ");
    let newText = "";

    for(i = 0; i < splitText.length; i++) {

     if(splitText.length - 1 === i) {
        newText += (splitText[i].charAt(0).toUpperCase() + splitText[i].substring(1));
      } else {
        newText += (splitText[i].charAt(0).toUpperCase() + splitText[i].substring(1) + " ");
      }
    }
    return newText;
  }

  render() {
    //field validation
    let locationErrors = this.validate(this.state.location, { required: true, match: true });
    let boxesErrors = this.validate(this.state.boxes, { required: true, numbers: true });
    let weightErrors = this.validate(this.state.weight, { required: true });
    let tagErrors = this.validate(this.state.tags, { required: true });
    let expirationErrors = this.validate(this.state.expirationDate, { required: true, time: true });
    let submitEnabled = (locationErrors.isValid && locationErrors.matchGood && boxesErrors.isValid && weightErrors.isValid && tagErrors.isValid && expirationErrors.isValid)

    const { query } = this.state;
    const markets = this.findMarket(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

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

    console.log("LOCATION", this.state);

    return (
      <Container style={{ alignSelf: 'center', width: '100%', backgroundColor: '#f6f6f6' }}>
        <Content>
          <View style={styles.messageView}>
            <Text style={styles.messageText}>What would you like to donate today?</Text>
          </View>
          <View style={{ width: '96%', alignSelf: 'center', marginTop: 10, }}>
            <View style={styles.view}>
              <Left style={styles.left}>
                <Icon name="map-marker" style={styles.icon} />
              </Left>
              <Right style={{ flex: 3, paddingLeft: '9%', borderWidth: 0, }} >

                <View style={{ zIndex: 1, width: '100%', marginRight: '10%', marginBottom: 0 }}>
                  <View style={styles.containerAuto}>
                    <Label style={styles.inputLabelMarket}>Enter Market Location</Label>
                    <Autocomplete
                      floatingLabel style={styles.inputField}
                      style={{ backgroundColor: '#f6f6f6', color: '#000000', fontSize: 16, borderColor: '#ffffff' }}
                      autoCapitalize="none"
                      autoCorrect={false}
                      data={markets.length === 1 && comp(query, markets[0].label) ? [] : markets}
                      defaultValue={query}
                      onChangeText={text => this.setState({ query: text, location: this.camelCase(text) })}
                      inputContainerStyle={{ borderWidth: 0, }}
                      containerStyle={{ margin: 0, borderWidth: 0, }}
                      listStyle={{ borderWidth: 0 }}
                      placeholder="ex: Ballard Farmers Market"
                      renderItem={({ label }) => (
                        <TouchableOpacity onPress={() => this.setState({ query: label, location: label })}>
                          <Text style={styles.itemText}>
                            {label}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>

                {this.renderErrorMsg(locationErrors)}
              </Right>
            </View>
            <View style={styles.view}>
              <Left style={styles.left}>
                <Icon name="cube" style={styles.icon} />
              </Left>
              <Right style={styles.right} >
                <InputField
                  label='Number of Boxes'
                  keyboard='numeric'
                  handleChange={(text) => this.setState({ boxes: text })}
                  secure={false}
                />
                {this.renderErrorMsg(boxesErrors)}
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
                {this.renderErrorMsg(weightErrors)}
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
                {this.renderErrorMsg(tagErrors)}
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
                {this.renderErrorMsg(expirationErrors)}
              </Right>
            </View>
            <DateTimePicker
              isVisible={this.state.isTimePickerVisible}
              onConfirm={this.handleTimePicked}
              onCancel={this.hideTimePicker}
              mode='time'
              style={{ marginBottom: 0, }}
            />
          </View>
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

const InputField = props => (
  <Item floatingLabel style={styles.inputField} >
    <Label style={styles.inputLabel}>{props.label}</Label>
    <Input
      keyboardType={props.keyboard}
      onChangeText={props.handleChange}
      secureTextEntry={props.secure}
      style={styles.input}
    />
  </Item>
);

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
    alignSelf: 'flex-start',
    width: '100%',
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
    width: '91%',
    marginRight: '8%',
    borderBottomWidth: 0.7,
    borderColor: '#247f6e',
    alignSelf: 'flex-end'
  },
  timepickertxt: {
    width: '88%',
    paddingLeft: 5,
    fontSize: 16,
    color: '#C7C6CC',
  },
  timepickertxtAlt: { // when time is picked
    width: '90%',
    fontSize: 16,
    color: '#333333'
  },
  timepickericon: {
    marginRight: '15%',
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
    marginTop: 10
  },
  submitBtnAlt: { // when button is enabled
    backgroundColor: '#44beac',
    marginTop: 10
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
  },
  messageView: {
    alignSelf: 'center',
    width: '100%',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  messageText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#f8b718',
    width: '100%',
    padding: 20,
    borderRadius: 10,
    fontSize: 16
  },
  errorText: {
    fontSize: 16,
    color: '#96372d',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: '2%',
    marginRight: '10%'
  },
  errorTextNearby: {
    fontSize: 16,
    color: '#96372d',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: '-8%',
    marginRight: '5%'
  },
  inputField: {
    width: '90%',
    alignSelf: 'flex-start',
    borderColor: '#247f6e',
    marginTop: -10,
  },
  input: {
    color: 'black',
  },
  inputLabel: {
    fontSize: 16,
    marginLeft: '2%',
    color: '#c3c3c8',
    marginTop: -13,
  },
  inputLabelMarket: {
    fontSize: 16,
    marginLeft: '2%',
    color: '#c3c3c8',
  },



  containerAuto: {
    flex: 1,
    paddingBottom: 0,
    marginBottom: 0,
    borderWidth: 0,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    paddingBottom: 0,
    borderWidth: 0,
  },
  itemText: {
    fontSize: 16,
    margin: 2,
    borderWidth: 0,
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    width: '100%',
    marginTop: 25,
    fontSize: 16,
    borderWidth: 0,

  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    alignItems: 'flex-start',
  },
  viewContainer: {
    width: '92%',
    alignSelf: 'flex-start',
    marginRight: '10%',
  },
  underline: {
    borderTopColor: '#247f6e',
    opacity: 1,
    borderTopWidth: .5
  },
});