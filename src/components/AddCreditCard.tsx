import * as React from "react";
import { Component, PropTypes } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import moment from 'moment';

import {isIOS, isNarrow} from '../Utilities';

import {CardDataForVerification} from '../reducers/addCreditCard';

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
  showCardNumberAsError: boolean;
  showCardExpMonthAsError: boolean;
  showCardExpYearAsError: boolean;
  showCardCvcAsError: boolean;
}

export interface AddCreditCardProps {
  attemptingVerification: boolean;
  isVerified: boolean;
  failed: boolean;
  failMessage: string;
  goBackToPurchase(): void;
  verifyCardDetailsWithStripe(CardDataForVerification): void;
  verificationFailed(errorMessage): void;
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
      showCardNumberAsError: false,
      showCardExpMonthAsError: false,
      showCardExpYearAsError: false,
      showCardCvcAsError: false,
    }
  }

  verifyCard(){
    if(this.clientSideVerify()) {
      Keyboard.dismiss();
      this.props.verifyCardDetailsWithStripe(this.packageCardData());
    }
  }

  packageCardData(): CardDataForVerification {
    return {
      cardNumber: this.getCardNumber(),
      cardExpMonth: this.state.cardExpMonth,
      cardExpYear: this.state.cardExpYear,
      cardCvc: this.state.cardCvc,
    }
  }

  clientSideVerify(): boolean{
    return this.isValidCardNumber(this.getCardNumber())
           && this.isValidCardExpMonth(this.state.cardExpMonth)
           && this.isValidCardExpYear(this.state.cardExpYear)
           && this.isValidCardCvc(this.state.cardCvc);
  }

  getCardNumber(): string {
    return this.state.cardNum1 + this.state.cardNum2 + this.state.cardNum3 + this.state.cardNum4;
  }

  isValidCardNumber(cardNum: string): boolean {
    if(isNaN(parseInt(cardNum)) || cardNum.length !== 16){
      this.props.verificationFailed("Invalid Card Number");
      this.updateState("showCardNumberAsError", true);
      return false;
    }

    this.updateState("showCardNumberAsError", false);
    return true;
  }

  isValidCardExpMonth(cardExpMonth: string): boolean{
    // parseInt returns NaN if cardExpMonth is not an int. NaN fails the
    // comparisons in the if statement.
    const month = parseInt(cardExpMonth);
    if(month >= 1 && month <= 12){
      this.updateState('showCardExpMonthAsError', false);
      return true;
    }

    this.updateState('showCardExpMonthAsError', true);
    this.props.verificationFailed("Invalid Expiration Month");
    return false;
  }

  isValidCardExpYear(cardExpYear: string): boolean{
    const thisYear: number = new Date().getFullYear();
    // The user input year is two digit and must be converted to 4 digits.
    // This is done by rounding the current year to the lowest hundred and
    // adding the year
    const year: number = parseInt(cardExpYear) + (Math.floor(thisYear  / 100) * 100);
    const validYearVariance: number = 20;

    if(year >= thisYear && year <= thisYear + validYearVariance){
      this.updateState('showCardExpYearAsError', false);
      return true;
    }

    this.updateState('showCardExpYearAsError', true);
    this.props.verificationFailed("Invalid Expiration Year");
    return false;
  }

  isValidCardCvc(cvc: string): boolean{
    const cvcInt: number = parseInt(cvc)
    if(cvc.length !== 3 || isNaN(cvcInt)){
      this.updateState('showCardCvcAsError', true);
      this.props.verificationFailed("Invalid CVC");
      return false;
    }

    this.updateState('showCardCvcAsError', false);
    return true;
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
              <Text style={globalStyles.bevLineTextTitle}>
              {`${!isNarrow ? "Card " : ""}`}Number:
              </Text>
            </View>
            <View style={[globalStyles.bevLineRight, {
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }]}>
              <CreditCardInput
                autoFocus={true}
                ref="1"
                value={this.state.cardNum1}
                nextRef={this.refs["2"]}
                maxChars={4}
                placeholder="1234"
                width={40}
                returnKeyType="next"
                showError={this.state.showCardNumberAsError}
                showEmpty={this.props.attemptingVerification}
                onChangeText={(text) => {
                  this.updateState("showCardNumberAsError", false);
                  this.updateState("cardNum1", text);
                }}
              />
              <CreditCardInput
                ref="2"
                value={this.state.cardNum2}
                nextRef={this.refs["3"]}
                maxChars={4}
                placeholder="5678"
                width={40}
                showError={this.state.showCardNumberAsError}
                showEmpty={this.props.attemptingVerification}
                onChangeText={(text) => {
                  this.updateState("showCardNumberAsError", false);
                  this.updateState("cardNum2", text);
                }}
              />
              <CreditCardInput
                ref="3"
                value={this.state.cardNum3}
                nextRef={this.refs["4"]}
                maxChars={4}
                placeholder="1234"
                width={40}
                showError={this.state.showCardNumberAsError}
                showEmpty={this.props.attemptingVerification}
                onChangeText={(text) => {
                  this.updateState("showCardNumberAsError", false);
                  this.updateState("cardNum3", text);
                }}
              />
              <CreditCardInput
                ref="4"
                value={this.state.cardNum4}
                nextRef={this.refs["5"]}
                maxChars={4}
                placeholder="5678"
                width={40}
                showError={this.state.showCardNumberAsError}
                showSpinner={this.props.attemptingVerification}
                onChangeText={(text) => {
                  this.updateState("showCardNumberAsError", false);
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
                  value={this.state.cardExpMonth}
                  nextRef={this.refs["6"]}
                  maxChars={2}
                  placeholder="01"
                  width={30}
                  showError={this.state.showCardExpMonthAsError}
                  showSpinner={this.props.attemptingVerification}
                  onChangeText={(text) => {
                  this.updateState("showCardExpMonthAsError", false);
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
                  value={this.state.cardExpYear}
                  nextRef={this.refs["7"]}
                  maxChars={2}
                  placeholder="20"
                  width={30}
                  showError={this.state.showCardExpYearAsError}
                  showSpinner={this.props.attemptingVerification}
                  onChangeText={(text) => {
                    this.updateState("showCardExpYearAsError", false);
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
                value={this.state.cardCvc}
                maxChars={3}
                placeholder="123"
                width={45}
                showError={this.state.showCardCvcAsError}
                showSpinner={this.props.attemptingVerification}
                onChangeText={(text) => {
                  this.updateState("showCardCvcAsError", false);
                  this.updateState("cardCvc", text);
                }}
                returnKeyType="done"
                onMaxLength={() => {
                  // Wait for the state to finish updating.
                  setTimeout(() => {
                    this.verifyCard();
                  }, 100);
                }}
              />
            </View>
          </View>
          {this.props.failed  && !this.props.attemptingVerification ?
            <View style={globalStyles.bevLine}>
              <View style={globalStyles.bevLineLeft}>
                <Text style={[{
                  color: 'red',
                }, globalStyles.bevLineTextTitle]}>
                  Error:
                </Text>
              </View>
              <View style={globalStyles.bevLineWideRight}>
                <Text
                  numberOfLines={5}
                >
                  {this.props.failMessage}
                </Text>
              </View>
            </View>
          :
          null}
          <View style={globalStyles.bevLastLine}>
            <View style={globalStyles.bevLineLeft}>
              <BevButton
                text="Cancel"
                shortText="Cancel"
                label="Cancel Add Credit Card Button"
                onPress={this.props.goBackToPurchase.bind(this)}
                buttonFontSize={20}
                margin={0}
              />
            </View>
            <View style={globalStyles.bevLineRight}>
              <BevButton
                text={this.props.attemptingVerification ? "Verifying" : "Verify Card"}
                shortText={this.props.attemptingVerification ? "Verifying" : "Verify"}
                label="Verify Credit Card Button"
                onPress={this.verifyCard.bind(this)}
                buttonFontSize={20}
                margin={0}
                showSpinner={this.props.attemptingVerification}
              />
            </View>
          </View>
        </View>
      </RouteWithNavBarWrapper>
    )
  }
}
interface CreditCardInputProps {
  autoFocus?: boolean;
  ref: string,
  nextRef?: any,
  width: number;
  maxChars: number;
  placeholder: string;
  value?: string;
  showSpinner?: boolean;
  showError?: boolean;
  showEmpty?: boolean;
  returnKeyType?: "next" | "done";
  onChangeText(string): void;
  onMaxLength?: Function;
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
    onMaxLength: undefined,
    returnKeyType: "next",
    showError: false,
    showSpinner: false,
    showEmpty: false,
    value: undefined,
    autoFocus: false,
  }

  onSubmit() {
    this.goToNextInput();
  }

  onMaxLength() {
    if(this.props.onMaxLength){
      this.props.onMaxLength();
    } else {
      this.goToNextInput();
    }
  }

  goToNextInput(){
    if(this.props.nextRef){
      this.props.nextRef.refs["textInput"].focus();
    }
  }

  render() {
    if(this.props.showEmpty) {
      return (
        <View></View>
      )
    }
    if(this.props.showSpinner){
      return (
        <ActivityIndicator
        style={{
          height: 45,
          width: this.props.width,
          flex: -1,
          alignSelf: 'center',
        }}
        />
      )
    }
    return(
      <View style={ this.props.showError ? {
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 0, 0, 0.75)',
      } : {
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 1)',
      }}>
        <TextInput
          style={{
            width: this.props.width,
            textAlign: 'center',
            height: 45,
          }}
          autoFocus={this.props.autoFocus}
          ref="textInput"
          value={this.props.value}
          keyboardType="numeric"
          returnKeyType={this.props.returnKeyType}
          maxLength={this.props.maxChars}
          placeholder={this.props.placeholder}
          placeholderTextColor={"#cccccc"}
          onChangeText={(text) => {
            this.props.onChangeText(text);
            if(text.length === this.props.maxChars){
              this.onMaxLength();
            }
          }}
          onSubmitEditing={this.onSubmit.bind(this)}
        />
      </View>
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
