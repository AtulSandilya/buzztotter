import React, { Component, PropTypes } from 'react';
import { Picker, Slider, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

import TitleText from './TitleText';
import BevButton from './components/BevButton';

import {globalColors} from './components/GlobalStyles';

const styles = StyleSheet.create({
  purchaseContainer: {
    flex: 1,
    padding: 20,
  },
  purchaseLine: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: globalColors.subtleSeparator,
    paddingBottom: 10,
    marginBottom: 20,
  },
  purchaseLineTextTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  purchaseLineText: {
    fontSize: 20,
  },
  purchaseLineLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  purchaseLineRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  purchaseLineSliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingRight: 10,
  },
  numBeersButtonContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  numBeersButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: globalColors.bevPrimary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  numBeersButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default class PurchaseBeer extends Component {
  constructor(props){
    super(props);
    this.state = {
      numDrinks: 1,
      purchaseConfirmed: false,
      paymentMethod: 'google_wallet',
    };
  }

  increaseNumDrinks(){
    this.updateNumDrinks(this.state.numDrinks + 1);
  }

  decreaseNumDrinks(){
    this.updateNumDrinks(this.state.numDrinks - 1);
  }

  updateNumDrinks(input){
    if(input >= 1 && input <= 10){
      this.setState({
        numDrinks: input
      });
    }
  }

  setPaymentMethod(input){
    this.setState({
      paymentMethod: input,
    });
  }

  static propTypes = {
    name: React.PropTypes.string,
    pricePerDrink: React.PropTypes.number,
    cancelPurchaseAction: React.PropTypes.func,
  }

  static defaultProps = {
    pricePerDrink: 6.00,
  }

  purchaseDrink() {
    this.setState({
      purchaseConfirmed: true,
    });
    // Wait and close modal
    setTimeout(() => {
      this.props.cancelPurchaseAction()
    }, 5000);
  }

  renderPurchaseConfirmed(){
    if(this.state.purchaseConfirmed){
      return (
        <View>
          <View style={{flex: 1, alignItems: 'center', paddingTop: 20}}>
            <Text style={{color: globalColors.bevPrimary, fontSize: 30}}>{this.state.numDrinks} {this.state.numDrinks > 1 ? "Beers" : "Beer"} sent to {this.props.name}!</Text>
          </View>
          <View style={{alignItems: 'flex-end', paddingTop: 10}}>
            <BevButton
              bevButtonPressed={this.props.cancelPurchaseAction}
              buttonText={"Close"}
              buttonFontSize={20}
            />
          </View>
        </View>
      )
    }
  }

  render() {
    return(
      <View style={styles.purchaseContainer}>
        <View>
          <TitleText title={"Purchase Beer"}></TitleText>
        </View>
        <View style={styles.purchaseLine}>
          <View style={styles.purchaseLineLeft}>
            <Text style={styles.purchaseLineTextTitle}>Receipent:</Text>
          </View>
          <View style={styles.purchaseLineRight}>
            <Text style={styles.purchaseLineText}>{this.props.name}</Text>
          </View>
        </View>
        <View style={styles.purchaseLine}>
          <View style={styles.purchaseLineLeft}>
            <Text style={styles.purchaseLineTextTitle}>Number of Beers:</Text>
          </View>
          <View style={styles.purchaseLineSliderContainer}>
            <View style={styles.numBeersButtonContainer}>
              <TouchableHighlight
                onPress={() => this.increaseNumDrinks()}
                hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                style={[styles.numBeersButton, {marginRight: 15}]}>
                  <Text style={styles.numBeersButtonText}>+</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => this.decreaseNumDrinks()}
                  hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                  style={styles.numBeersButton}>
                  <Text style={styles.numBeersButtonText}>-</Text>
                </TouchableHighlight>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Text style={styles.purchaseLineTextTitle}>{this.state.numDrinks}</Text>
            </View>
          </View>
        </View>
        <View style={styles.purchaseLine}>
          <View style={styles.purchaseLineLeft}>
            <Text style={styles.purchaseLineTextTitle}>Cost:</Text>
          </View>
          <View style={[styles.purchaseLineRight, {flex: 1}]}>
            <Text style={styles.purchaseLineText}>$ {(this.props.pricePerDrink * this.state.numDrinks).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.purchaseLine}>
          <View style={styles.purchaseLineLeft}>
            <Text style={styles.purchaseLineTextTitle}>Payment Method:</Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Picker
              selectedValue={this.state.paymentMethod}
              onValueChange={(paymentMethod) => this.setPaymentMethod(paymentMethod)}
              style={{flex: 1}}
            >
              <Picker.Item label="Google Wallet" value="google_wallet" />
              <Picker.Item label="PayPal" value="paypal" />
            </Picker>
          </View>
        </View>
        <View>
          <Text style={styles.purchaseLineTextTitle}>Message:</Text>
        </View>
        <View>
          <TextInput
            placeholder={"Happy Birthday! Have a cold one on me!"}
            placeholderTextColor={"#cccccc"}
            style={{flex: 1}}
          />
        </View>
        <View style={{flexDirection: 'row', paddingTop: 20}}>
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <BevButton
              bevButtonPressed={this.props.cancelPurchaseAction}
              buttonText={"Cancel"}
              buttonFontSize={20}
            />
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <BevButton
              bevButtonPressed={this.purchaseDrink.bind(this)}
              buttonText={"Confirm Purchase"}
              buttonFontSize={20}
            />
          </View>
        </View>
        {this.renderPurchaseConfirmed()}
      </View>
    );
  }
}
