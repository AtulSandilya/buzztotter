import React, { Component, PropTypes } from 'react';
import { Picker, Slider, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

import TitleText from './TitleText';
import BevButton from './BevButton';

import {globalColors} from './GlobalStyles';

export default class PurchaseBeer extends Component {
  constructor(props){
    super(props);
    this.state = {
      numDrinks: 1,
      cardNum1: "",
      cardNum2: "",
      cardNum3: "",
      cardNum4: "",
      cardExpMonth: "",
      cardExpYear: "",
      cardCvc: "",
    };
  }

  static propTypes = {
    fullName: React.PropTypes.string,
    firstName: React.PropTypes.string,
    pricePerDrink: React.PropTypes.number,
    closePurchaseModal: React.PropTypes.func,
  }

  static defaultProps = {
    pricePerDrink: 6.00,
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

  attemptCreditCardPurchase(){
    let cardData = {}
    cardData.cardNumber = this.state.cardNum1 + this.state.cardNum2 + this.state.cardNum3 + this.state.cardNum4;
    cardData.cardExpMonth = this.state.cardExpMonth;
    cardData.cardExpYear = this.state.cardExpYear;
    cardData.cardCvc = this.state.cardCvc;

    if(
      this.isValidCardNumber(cardData.cardNumber)
      && this.isValidCardExp(cardData.cardExpMonth)
      && this.isValidCardExp(cardData.cardExpYear)
      && this.isValidCardCvc(cardData.cardCvc)
    ){
      let purchaseData = {
        // Stripe likes the payment value to be cents, (100 cents = 1 dollar)
        amount: (this.state.numDrinks * this.props.pricePerDrink) * 100,
        description: "Sent " + this.state.numDrinks + " Bevegram" + (this.state.numDrinks > 1 ? "s" : "") + " to " + this.props.fullName,
      }
      this.props.startCreditCardPurchase(cardData, purchaseData);
    }

  }

  isValidCardNumber(cardNum) {
    if(cardNum.length !== 16){
      this.creditCardErrorAlert("Invalid card number!");
      return false;
    }
    return true;
  }

  isValidCardExp(cardExp){
    if(cardExp.length < 1){
      this.creditCardErrorAlert("Invalid expiration date!");
      return false;
    }
    return true;
  }

  isValidCardCvc(cvc){
    if(cvc.length !== 3){
      this.creditCardErrorAlert("Invalid CVC!");
      return false;
    }
    return true;
  }

  creditCardErrorAlert(message){
    alert("Credit Card Error: " + message);
  }

  updateState(property, value){
    this.setState(function(prevState, currentProps){
      let nextState = Object.assign({}, prevState);
      nextState[property] = value;
      return nextState;
    });
  }

  setPaymentMethod(input){
    this.setState({
      paymentMethod: input,
    });
  }

  purchaseDrink() {
    this.attemptCreditCardPurchase();
  }

  renderPurchaseConfirmed(){
    if(this.state.purchaseConfirmed){
      return (
        <View>
          <View style={{flex: 1, alignItems: 'center', paddingTop: 20}}>
            <Text style={{color: globalColors.bevPrimary, fontSize: 30}}>{this.state.numDrinks} {this.state.numDrinks > 1 ? "Beers" : "Beer"} sent to {this.props.firstName}!</Text>
          </View>
          <View style={{alignItems: 'flex-end', paddingTop: 10}}>
            <BevButton
              bevButtonPressed={this.props.closePurchaseModal}
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
            <Text style={styles.purchaseLineText}>{this.props.fullName}</Text>
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
            <Text style={styles.purchaseLineTextTitle}>Card Number:</Text>
          </View>
          <View style={[styles.purchaseLineRight, {
            flexDirection: 'row'
          }]}>
            <CreditCardInput
              ref="1"
              maxChars={4}
              placeholder="1234"
              width={40}
              onChangeText={(text) => {
                this.updateState("cardNum1", text);
              }}
              onSubmit={() => {
                this.refs["2"].defaultProps.focus();
              }}
            />
            <CreditCardInput
              ref="2"
              maxChars={4}
              placeholder="5678"
              width={40}
              onChangeText={(text) => {
                this.updateState("cardNum2", text);
              }}
              onSubmit={() => this.refs["3"].defaultProps.focus()}
            />
            <CreditCardInput
              ref="3"
              maxChars={4}
              placeholder="1234"
              width={40}
              onChangeText={(text) => {
                this.updateState("cardNum3", text);
              }}
              onSubmit={() => this.refs["4"].defaultProps.focus()}
            />
            <CreditCardInput
              ref="4"
              maxChars={4}
              placeholder="5678"
              width={40}
              onChangeText={(text) => {
                this.updateState("cardNum4", text);
              }}
              onSubmit={() => this.refs["5"].defaultProps.focus()}
            />
          </View>
        </View>
        <View style={styles.purchaseLine}>
          <View style={styles.purchaseLineLeft}>
            <Text style={styles.purchaseLineTextTitle}>Exp Date:</Text>
          </View>
          <View style={[styles.purchaseLineRight,
            {
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }]}
          >
            <View
            style={{
              flex: -1,
              flexDirection: 'row',
            }}
            >
              <CreditCardInput
                ref="5"
                maxChars={2}
                placeholder="01"
                width={30}
                onChangeText={(text) => {
                  this.updateState("cardExpMonth", text);
                }}
                onSubmit={() => this.refs["6"].defaultProps.focus()}
              />
              <View style={{
                width: 2,
                backgroundColor: '#999999',
                transform: [{rotate: '15deg'}],
                marginRight: 5,
                marginLeft: 10,
                marginVertical: 8,
              }}></View>
              <CreditCardInput
                ref="6"
                maxChars={2}
                placeholder="20"
                width={30}
                onChangeText={(text) => {
                  this.updateState("cardExpYear", text);
                }}
                onSubmit={() => this.refs["7"].defaultProps.focus()}
              />
            </View>
          </View>
        </View>
        <View style={styles.purchaseLine}>
          <View style={styles.purchaseLineLeft}>
            <Text style={styles.purchaseLineTextTitle}>CVC:</Text>
          </View>
          <View style={[styles.purchaseLineRight, {
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }]}>
            <CreditCardInput
              ref="7"
              maxChars={3}
              placeholder="123"
              width={45}
              onChangeText={(text) => {
                this.updateState("cardCvc", text);
              }}
              returnKeyType="done"
            />
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
              bevButtonPressed={this.props.closePurchaseModal}
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

class CreditCardInput extends Component {
  defaultProps = {
    returnKeyType: "search",
    onSubmit: () => {},
    focus: () => {
      this.refs.textInput.focus()
    }
  }
  render() {
    return(
      <TextInput
        style={{
          width: this.props.width,
          textAlign: 'center',
        }}
        ref="textInput"
        keyboardType="numeric"
        returnKeyType="next"
        maxLength={this.props.maxChars}
        placeholder={this.props.placeholder}
        placeholderTextColor={"#cccccc"}
        onChangeText={this.props.onChangeText}
        onSubmitEditing={this.props.onSubmit}
      />
    );
  }
}

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
