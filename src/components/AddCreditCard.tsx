import * as React from "react";
import { Component, PropTypes } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import {isIOS} from '../Utilities';

import BevButton from './BevButton';
import RouteWithNavBarWrapper from './RouteWithNavBarWrapper';
import {globalStyles} from './GlobalStyles';

interface AddCreditCardState {
  cardNum1: string;
  cardNum2: string;
  cardNum3: string;
  cardNum4: string;
  cardExpMonth: string;
  cardExpYear: string;
  cardCvc: string;
}

export interface AddCreditCardProps {
  goBackToPurchase(): void;
}

export default class AddCreditCard extends Component<AddCreditCardProps, AddCreditCardState> {
  constructor(props){
    super(props);
    this.state = {
      cardNum1: "",
      cardNum2: "",
      cardNum3: "",
      cardNum4: "",
      cardExpMonth: "",
      cardExpYear: "",
      cardCvc: "",
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

  render(){
    return (
      <RouteWithNavBarWrapper>
        <View style={globalStyles.bevContainer}>
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>Card Number:</Text>
            </View>
            <View style={[globalStyles.bevLineRight, {
              flexDirection: 'row',
              flex: -1,
              alignItems: 'flex-end',
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
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>Exp Date:</Text>
            </View>
            <View style={[globalStyles.bevLineRight,
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
                <View style={[{
                  width: 2,
                  backgroundColor: '#999999',
                  marginRight: 5,
                  marginLeft: 10,
                  marginVertical: 8,
                }, styles.rotateSlash]}></View>
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
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>CVC:</Text>
            </View>
            <View style={[globalStyles.bevLineRight, {
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
          <View style={globalStyles.bevLastLine}>
            <View style={globalStyles.bevLineLeft}>
              <BevButton
                buttonText="Cancel"
                bevButtonPressed={this.props.goBackToPurchase.bind(this)}
                buttonFontSize={20}
                margin={0}
              />
            </View>
            <View style={globalStyles.bevLineRight}>
              <BevButton
                buttonText="Verify Card"
                bevButtonPressed={() => alert("Verify")}
                buttonFontSize={20}
                margin={0}
              />
            </View>
          </View>
        </View>
      </RouteWithNavBarWrapper>
    )
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
          height: 45,
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


interface Style {
  rotateSlash: React.TransformsStyle;
}

const styles = StyleSheet.create<Style>({
  rotateSlash: {
    transform: [{rotate: '15deg'}],
  },
})
