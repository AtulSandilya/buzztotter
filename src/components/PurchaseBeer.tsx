import * as React from "react";
import { Component, PropTypes } from 'react';
import { ActivityIndicator, Picker, Slider, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

import {isIOS} from '../Utilities';

import { CardResponseData, PurchaseState } from '../reducers/purchase';

import TitleText from './TitleText';
import BevButton from './BevButton';

import {globalColors} from './GlobalStyles';

interface CardData {
  cardNumber: string;
  cardExpMonth: string;
  cardExpYear: string;
  cardCvc: string;
}

interface PurchaseData {
  amount: number;
  description: string;
}

interface VProps {
  fullName: string;
  firstName: string;
  purchase: PurchaseState;
  resetPurchase();
  closePurchaseModal();
  startCreditCardPurchase(CardData, PurchaseData);
}

interface VState {
  numDrinks: number;
  cardNum1: string;
  cardNum2: string;
  cardNum3: string;
  cardNum4: string;
  cardExpMonth: string;
  cardExpYear: string;
  cardCvc: string;
}

export default class PurchaseBeer extends Component<VProps, VState> {

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

  increaseNumDrinks(){
    this.updateNumDrinks(this.state.numDrinks + 1);
  }

  decreaseNumDrinks(){
    this.updateNumDrinks(this.state.numDrinks - 1);
  }

  updateNumDrinks(input){
    if(input >= 1 && input <= 10){
      this.updateState("numDrinks", input);
    }
  }

  attemptCreditCardPurchase(){
    let cardData = {
      cardNumber: this.state.cardNum1 + this.state.cardNum2 + this.state.cardNum3 + this.state.cardNum4,
      cardExpMonth: this.state.cardExpMonth,
      cardExpYear: this.state.cardExpYear,
      cardCvc: this.state.cardCvc,
    }

    if(
      this.isValidCardNumber(cardData.cardNumber)
      && this.isValidCardExp(cardData.cardExpMonth)
      && this.isValidCardExp(cardData.cardExpYear)
      && this.isValidCardCvc(cardData.cardCvc)
    ){
      let purchaseData = {
        // Stripe likes the payment value to be cents, (100 cents = 1 dollar)
        amount: (this.state.numDrinks * this.props.purchase.pricePerDrink) * 100,
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

  purchaseDrink() {
    this.attemptCreditCardPurchase();
  }

  renderPurchaseOptions(){
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
            <Text style={styles.purchaseLineText}>$ {(this.props.purchase.pricePerDrink * this.state.numDrinks).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.purchaseLine} ref="test">
          <View style={styles.purchaseLineLeft}>
            <Text style={styles.purchaseLineTextTitle}>Card Number:</Text>
          </View>
          <View style={[styles.purchaseLineRight, {
            flexDirection: 'row'
          }]}>
            <CreditCardInput
              ref="1"
              nextRef={this.refs["2"]}
              maxChars={4}
              placeholder="1234"
              width={40}
              returnKeyType="next"
              onChangeText={(text) => {
                this.updateState("cardNum1", text);
              }}
            />
            <CreditCardInput
              ref="2"
              nextRef={this.refs["3"]}
              maxChars={4}
              placeholder="5678"
              width={40}
              onChangeText={(text) => {
                this.updateState("cardNum2", text);
              }}
            />
            <CreditCardInput
              ref="3"
              nextRef={this.refs["4"]}
              maxChars={4}
              placeholder="1234"
              width={40}
              onChangeText={(text) => {
                this.updateState("cardNum3", text);
              }}
            />
            <CreditCardInput
              ref="4"
              nextRef={this.refs["5"]}
              maxChars={4}
              placeholder="5678"
              width={40}
              onChangeText={(text) => {
                this.updateState("cardNum4", text);
              }}
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
                nextRef={this.refs["6"]}
                maxChars={2}
                placeholder="01"
                width={30}
                onChangeText={(text) => {
                  this.updateState("cardExpMonth", text);
                }}
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
                nextRef={this.refs["7"]}
                maxChars={2}
                placeholder="20"
                width={30}
                onChangeText={(text) => {
                  this.updateState("cardExpYear", text);
                }}
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
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row',
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
      </View>
    );
  }

  renderPurchaseAttempting(){
    return (
      <View style={styles.purchaseContainer}>
        <View>
          <TitleText title={"Purchase Beer"}></TitleText>
        </View>
        <View style={styles.purchaseLine}>
          <Text>
            Sending {this.state.numDrinks} {this.state.numDrinks > 1 ? "Beers" : "Beer"} to {this.props.firstName}!
          </Text>
        </View>
        <StatusLine
          title="Verify Card"
          input={this.props.purchase.creditCardVerified}
          allFailed={this.props.purchase.failed}
        />
        <View style={styles.purchaseLine}>
          <View style={styles.purchaseLineLeft}>
            <Text style={styles.purchaseLineTextTitle}>Card Used:</Text>
          </View>
          <View style={styles.purchaseLineRight}>
            {this.props.purchase.creditCardVerified ?
              <Text>
                {this.props.purchase.data.brand} ... {this.props.purchase.data.last4}
              </Text>
              :
              <Text>
                ... {this.state.cardNum4}
              </Text>
            }
          </View>
        </View>
        <StatusLine
          title="Verify Purchase"
          input={this.props.purchase.confirmed}
          waiting={this.props.purchase.creditCardVerified === undefined}
          allFailed={this.props.purchase.failed}
        />
        {this.props.purchase.failed ?
        <View>
          <View style={[styles.purchaseLine, {
            flex: -1,
          }]}>
            <Text style={{fontWeight: 'bold', paddingBottom: 10, color: 'red'}}>Unable to complete purchase:</Text>
            <Text>{this.props.purchase.failMessage}</Text>
          </View>
          <View>
            <View style={{
              flex: 1,
              flexDirection: 'row',
            }}>
              <View style={{flex: 1, alignItems: 'flex-start', paddingTop: 10}}>
                <BevButton
                  bevButtonPressed={this.props.closePurchaseModal}
                  buttonText={"Close"}
                  buttonFontSize={20}
                />
              </View>
              <View style={{flex: 1, alignItems: 'flex-end', paddingTop: 10}}>
                <BevButton
                  bevButtonPressed={this.props.resetPurchase}
                  buttonText={"Try Again"}
                  buttonFontSize={20}
                />
              </View>
            </View>
          </View>
        </View>
        :
        <View/>
        }
        {this.renderPurchaseConfirmed()}
      </View>
    )
  }

  renderPurchaseConfirmed(){
    if(this.props.purchase.confirmed){
      return (
      <View>
        <View style={styles.purchaseLine}>
          <View style={{flex: 1}}>
            <Text
              style={{
                fontWeight: 'bold',
              }}
            >
              {this.state.numDrinks} {this.state.numDrinks > 1 ? "Beers" : "Beer"} sent to {this.props.firstName}!
            </Text>
          </View>
        </View>
        <View>
          <View style={{alignItems: 'flex-end', paddingTop: 10}}>
            <BevButton
              bevButtonPressed={this.props.closePurchaseModal}
              buttonText={"Close"}
              buttonFontSize={20}
            />
          </View>
        </View>
      </View>
      )
    }
    return <View/>
  }

  render() {
    if(this.props.purchase.attempting){
      return this.renderPurchaseAttempting();
    }

    return this.renderPurchaseOptions();
  }
}

interface CreditCardInputProps {
  ref: string,
  nextRef?: any,
  width: number;
  maxChars: number;
  placeholder: string;
  returnKeyType?: "next" | "done";
  onChangeText(string): void;
}

interface CreditCardInputState {}

class CreditCardInput extends Component<CreditCardInputProps, CreditCardInputState> {

  public static defaultProps: CreditCardInputProps = {
    ref: undefined,
    nextRef: undefined,
    width: undefined,
    maxChars: undefined,
    placeholder: "",
    onChangeText: undefined,
    returnKeyType: "next",
  }

  onSubmit() {
    if(this.props.nextRef){
      this.props.nextRef.refs["textInput"].focus();
    }
  }

  render() {
    return(
      <TextInput
        style={{
          width: this.props.width,
          textAlign: 'center',
          height: isIOS ? 45 : undefined,
        }}
        ref="textInput"
        keyboardType="numeric"
        returnKeyType={this.props.returnKeyType}
        maxLength={this.props.maxChars}
        placeholder={this.props.placeholder}
        placeholderTextColor={"#cccccc"}
        onChangeText={this.props.onChangeText}
        onSubmitEditing={this.onSubmit.bind(this)}
      />
    );
  }
}

const StatusLine = ({title, input, allFailed, waiting = false}) => {
  let text = "";
  let color = "#000000";
  if(allFailed){
    text = "Failure"
    color = "red";
  } else if(waiting){
    text = "Waiting"
  } else if(input === undefined){
    text = "Pending"
  } else if (input === true) {
    text = "Success!"
    color = "green"
  } else if (input === false) {
    text = "Failure"
    color = "red";
  }

  return (
    <View style={styles.purchaseLine}>
      <View style={styles.purchaseLineLeft}>
        <Text style={styles.purchaseLineTextTitle}>
          {title}:
        </Text>
      </View>
      <View style={styles.purchaseLineRight}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <View>
            {input === undefined && waiting === false && allFailed !== true ? <ActivityIndicator style={{marginRight: 10}}/> : <View />}
          </View>
          <Text
            style={{
              color: color,
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    </View>
  )
}

interface Style {
  purchaseContainer: React.ViewStyle;
  purchaseLine: React.ViewStyle;
  purchaseLineTextTitle: React.TextStyle;
  purchaseLineText: React.TextStyle;
  purchaseLineLeft: React.ViewStyle;
  purchaseLineRight: React.ViewStyle;
  purchaseLineSliderContainer: React.ViewStyle;
  numBeersButtonContainer: React.ViewStyle;
  numBeersButton: React.ViewStyle;
  numBeersButtonText: React.TextStyle;
}

const styles = StyleSheet.create<Style>({
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
