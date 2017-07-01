import * as React from "react";
import { Component } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TransformsStyle,
  View,
} from "react-native";

import moment from "moment";

import { isIOS, isNarrow } from "../ReactNativeUtilities";

import { CardDataForVerification } from "../reducers/addCreditCard";

import BevButton from "./BevButton";
import { globalStyles } from "./GlobalStyles";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";

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

/* tslint:disable:member-ordering */
export default class AddCreditCard extends Component<
  AddCreditCardProps,
  AddCreditCardState
> {
  constructor(props) {
    super(props);
    this.state = {
      cardCvc: "",
      cardExpMonth: "",
      cardExpYear: "",
      cardNum1: "",
      cardNum2: "",
      cardNum3: "",
      cardNum4: "",
      showCardCvcAsError: false,
      showCardExpMonthAsError: false,
      showCardExpYearAsError: false,
      showCardNumberAsError: false,
    };
  }

  private verifyCard() {
    if (this.clientSideVerify()) {
      Keyboard.dismiss();
      this.props.verifyCardDetailsWithStripe(this.packageCardData());
    }
  }

  private packageCardData(): CardDataForVerification {
    return {
      cardCvc: this.state.cardCvc,
      cardExpMonth: this.state.cardExpMonth,
      cardExpYear: this.state.cardExpYear,
      cardNumber: this.getCardNumber(),
    };
  }

  private clientSideVerify(): boolean {
    return (
      this.isValidCardNumber(this.getCardNumber()) &&
      this.isValidCardExpMonth(this.state.cardExpMonth) &&
      this.isValidCardExpYear(this.state.cardExpYear) &&
      this.isValidCardCvc(this.state.cardCvc)
    );
  }

  private getCardNumber(): string {
    return (
      this.state.cardNum1 +
      this.state.cardNum2 +
      this.state.cardNum3 +
      this.state.cardNum4
    );
  }

  private isValidCardNumber(cardNum: string): boolean {
    /* tslint:disable:no-magic-numbers */
    if (isNaN(parseInt(cardNum, 10)) || cardNum.length !== 16) {
      this.props.verificationFailed("Invalid Card Number");
      this.updateState("showCardNumberAsError", true);
      return false;
    }

    this.updateState("showCardNumberAsError", false);
    return true;
  }

  private isValidCardExpMonth(cardExpMonth: string): boolean {
    // parseInt returns NaN if cardExpMonth is not an int. NaN fails the
    // comparisons in the if statement.
    const month = parseInt(cardExpMonth, 10);
    if (month >= 1 && month <= 12) {
      this.updateState("showCardExpMonthAsError", false);
      return true;
    }

    this.updateState("showCardExpMonthAsError", true);
    this.props.verificationFailed("Invalid Expiration Month");
    return false;
  }

  private isValidCardExpYear(cardExpYear: string): boolean {
    const thisYear: number = new Date().getFullYear();
    // The user input year is two digit and must be converted to 4 digits.
    // This is done by rounding the current year to the lowest hundred and
    // adding the year
    const year: number =
      parseInt(cardExpYear, 10) + Math.floor(thisYear / 100) * 100;
    const validYearVariance: number = 20;

    if (year >= thisYear && year <= thisYear + validYearVariance) {
      this.updateState("showCardExpYearAsError", false);
      return true;
    }

    this.updateState("showCardExpYearAsError", true);
    this.props.verificationFailed("Invalid Expiration Year");
    return false;
  }

  private isValidCardCvc(cvc: string): boolean {
    const cvcInt: number = parseInt(cvc, 10);
    if (cvc.length !== 3 || isNaN(cvcInt)) {
      this.updateState("showCardCvcAsError", true);
      this.props.verificationFailed("Invalid CVC");
      return false;
    }

    this.updateState("showCardCvcAsError", false);
    return true;
  }

  private updateState(property, value) {
    this.setState((prevState, currentProps) => {
      const nextState = { ...prevState };
      nextState[property] = value;
      return nextState;
    });
  }

  public render() {
    return (
      <RouteWithNavBarWrapper>
        <View style={globalStyles.bevContainer}>
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>
                {`${!isNarrow ? "Card " : ""}`}Number:
              </Text>
            </View>
            <View
              style={[
                globalStyles.bevLineRight,
                {
                  alignItems: "center",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                },
              ]}
            >
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
                onChangeText={text => {
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
                onChangeText={text => {
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
                onChangeText={text => {
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
                onChangeText={text => {
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
            <View
              style={[
                globalStyles.bevLineRight,
                {
                  alignItems: "flex-end",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                },
              ]}
            >
              <View
                style={{
                  flex: -1,
                  flexDirection: "row",
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
                  onChangeText={text => {
                    this.updateState("showCardExpMonthAsError", false);
                    this.updateState("cardExpMonth", text);
                  }}
                />
                <View
                  style={[
                    {
                      backgroundColor: "#999999",
                      marginLeft: 10,
                      marginRight: 5,
                      marginVertical: 8,
                      width: 2,
                    },
                    styles.rotateSlash,
                  ]}
                />
                <CreditCardInput
                  ref="6"
                  value={this.state.cardExpYear}
                  nextRef={this.refs["7"]}
                  maxChars={2}
                  placeholder="20"
                  width={30}
                  showError={this.state.showCardExpYearAsError}
                  showSpinner={this.props.attemptingVerification}
                  onChangeText={text => {
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
            <View
              style={[
                globalStyles.bevLineRight,
                {
                  alignItems: "center",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                },
              ]}
            >
              <CreditCardInput
                ref="7"
                value={this.state.cardCvc}
                maxChars={3}
                placeholder="123"
                width={45}
                showError={this.state.showCardCvcAsError}
                showSpinner={this.props.attemptingVerification}
                onChangeText={text => {
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
          {this.props.failed && !this.props.attemptingVerification
            ? <View style={globalStyles.bevLine}>
                <View
                  style={[
                    globalStyles.bevLineLeft,
                    { justifyContent: "flex-start" },
                  ]}
                >
                  <Text
                    style={[
                      {
                        color: "red",
                        paddingRight: 10,
                      },
                      globalStyles.bevLineTextTitle,
                    ]}
                  >
                    Error:
                  </Text>
                </View>
                <View style={globalStyles.bevLineWideRight}>
                  <Text numberOfLines={Infinity}>
                    {this.props.failMessage}
                  </Text>
                </View>
              </View>
            : null}
          <View style={globalStyles.bevLastLine}>
            <View style={globalStyles.bevLineLeft}>
              <BevButton
                text="Cancel"
                shortText="Cancel"
                label="Cancel Add Credit Card Button"
                onPress={this.props.goBackToPurchase}
                buttonFontSize={20}
                margin={0}
              />
            </View>
            <View style={globalStyles.bevLineRight}>
              <BevButton
                text={
                  this.props.attemptingVerification
                    ? "Verifying"
                    : "Verify Card"
                }
                shortText={
                  this.props.attemptingVerification ? "Verifying" : "Verify"
                }
                label="Verify Credit Card Button"
                onPress={this.verifyCard}
                buttonFontSize={20}
                margin={0}
                showSpinner={this.props.attemptingVerification}
              />
            </View>
          </View>
        </View>
      </RouteWithNavBarWrapper>
    );
  }
}
interface CreditCardInputProps {
  autoFocus?: boolean;
  ref: string;
  nextRef?: any;
  width: number;
  maxChars: number;
  placeholder: string;
  value?: string;
  showSpinner?: boolean;
  showError?: boolean;
  showEmpty?: boolean;
  returnKeyType?: "next" | "done";
  onChangeText(text: string): void;
  onMaxLength?: () => void;
}

/* tslint:disable:max-classes-per-file */
class CreditCardInput extends Component<
  CreditCardInputProps,
  {},
> {
  public static defaultProps: CreditCardInputProps = {
    autoFocus: false,
    maxChars: undefined,
    nextRef: undefined,
    onChangeText: undefined,
    onMaxLength: undefined,
    placeholder: "",
    ref: undefined,
    returnKeyType: "next",
    showEmpty: false,
    showError: false,
    showSpinner: false,
    value: undefined,
    width: undefined,
  };

  private onSubmit() {
    this.goToNextInput();
  }

  private onMaxLength() {
    if (this.props.onMaxLength) {
      this.props.onMaxLength();
    } else {
      this.goToNextInput();
    }
  }

  private goToNextInput() {
    if (this.props.nextRef) {
      this.props.nextRef.refs.textInput.focus();
    }
  }

  public render() {
    const oneCharWidth = 12;
    if (this.props.showEmpty) {
      return <View />;
    }
    if (this.props.showSpinner) {
      return (
        <ActivityIndicator
          style={{
            alignSelf: "center",
            flex: -1,
            height: 45,
            width: this.props.width,
          }}
        />
      );
    }
    return (
      <View
        style={
          this.props.showError
            ? {
                borderBottomWidth: 1,
                borderColor: "rgba(255, 0, 0, 0.75)",
              }
            : {
                borderBottomWidth: 1,
                borderColor: "rgba(255, 255, 255, 1)",
              }
        }
      >
        <TextInput
          style={{
            height: 45,
            textAlign: "center",
            width: this.props.maxChars * oneCharWidth,
          }}
          autoFocus={this.props.autoFocus}
          ref="textInput"
          value={this.props.value}
          keyboardType="numeric"
          returnKeyType={this.props.returnKeyType}
          maxLength={this.props.maxChars}
          placeholder={this.props.placeholder}
          placeholderTextColor={"#cccccc"}
          onChangeText={text => {
            this.props.onChangeText(text);
            if (text.length === this.props.maxChars) {
              this.onMaxLength();
            }
          }}
          onSubmitEditing={this.onSubmit}
        />
      </View>
    );
  }
}

interface Style {
  rotateSlash: TransformsStyle;
}

const styles = StyleSheet.create<Style>({
  rotateSlash: {
    transform: [{ rotate: "15deg" }],
  },
});
