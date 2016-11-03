import * as React from "react";
import { Component, PropTypes } from 'react';
import { StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { CardResponseData, PurchaseState } from '../reducers/purchase';

import StatusLine from './StatusLine';
import RouteWithNavBarWrapper from './RouteWithNavBarWrapper';
import TitleText from './TitleText';
import BevButton from './BevButton';

import {globalColors, globalStyles} from './GlobalStyles';

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

interface PurchaseBeerProps {
  fullName: string;
  firstName: string;
  purchase: PurchaseState;
  resetPurchase();
  closePurchaseRoute();
  startCreditCardPurchase(CardData, PurchaseData);
  goToAddCreditCardRoute();
}

interface PurchaseBeerState {
  numDrinks: number;
}

export default class PurchaseBeer extends Component<PurchaseBeerProps, PurchaseBeerState> {

  constructor(props){
    super(props);
    this.state = {
      numDrinks: 1,
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
    // let cardData = {
    //   cardNumber: this.state.cardNum1 + this.state.cardNum2 + this.state.cardNum3 + this.state.cardNum4,
    //   cardExpMonth: this.state.cardExpMonth,
    //   cardExpYear: this.state.cardExpYear,
    //   cardCvc: this.state.cardCvc,
    // }

    // if(
    //   this.isValidCardNumber(cardData.cardNumber)
    //   && this.isValidCardExp(cardData.cardExpMonth)
    //   && this.isValidCardExp(cardData.cardExpYear)
    //   && this.isValidCardCvc(cardData.cardCvc)
    // ){
    //   let purchaseData = {
    //     // Stripe likes the payment value to be cents, (100 cents = 1 dollar)
    //     amount: (this.state.numDrinks * this.props.purchase.pricePerDrink) * 100,
    //     description: "Sent " + this.state.numDrinks + " Bevegram" + (this.state.numDrinks > 1 ? "s" : "") + " to " + this.props.fullName,
    //   }
    //   this.props.startCreditCardPurchase(cardData, purchaseData);
    // }

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
      <RouteWithNavBarWrapper>
        <View style={globalStyles.bevContainer}>
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>Receipent:</Text>
            </View>
            <View style={globalStyles.bevLineRight}>
              <Text style={globalStyles.bevLineText}>{this.props.fullName}</Text>
            </View>
          </View>
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>Number of Beers:</Text>
            </View>
            <View style={styles.numBeersContainer}>
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
                <Text style={globalStyles.bevLineTextTitle}>{this.state.numDrinks}</Text>
              </View>
            </View>
          </View>
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>Cost:</Text>
            </View>
            <View style={[globalStyles.bevLineRight, {flex: 1}]}>
              <Text style={globalStyles.bevLineText}>$ {(this.props.purchase.pricePerDrink * this.state.numDrinks).toFixed(2)}</Text>
            </View>
          </View>
          <View style={globalStyles.bevLine}>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
              }}
              onPress={() => {
                this.props.goToAddCreditCardRoute();
              }}
            >
              <View style={globalStyles.bevLineLeft}>
                <Text style={[globalStyles.bevLineTextTitle, {fontWeight: "normal"}]}>Add Credit Card</Text>
              </View>
              <View style={globalStyles.bevLineRight}>
                <Icon name="ios-arrow-forward" size={35} />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={globalStyles.bevLineTextTitle}>Message:</Text>
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
                bevButtonPressed={this.props.closePurchaseRoute}
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
          <View style={{height: 20}}></View>
        </View>
      </RouteWithNavBarWrapper>
    );
  }

  renderPurchaseAttempting(){
    return (
      <View style={globalStyles.bevContainer}>
        <View style={globalStyles.bevLine}>
          <Text>
            Sending {this.state.numDrinks} {this.state.numDrinks > 1 ? "Beers" : "Beer"} to {this.props.firstName}!
          </Text>
        </View>
        <StatusLine
          title="Verify Card"
          input={this.props.purchase.creditCardVerified}
          allFailed={this.props.purchase.failed}
        />
        <View style={globalStyles.bevLine}>
          <View style={globalStyles.bevLineLeft}>
            <Text style={globalStyles.bevLineTextTitle}>Card Used:</Text>
          </View>
          <View style={globalStyles.bevLineRight}>
            {this.props.purchase.creditCardVerified ?
              <Text>
                {this.props.purchase.data.brand} ... {this.props.purchase.data.last4}
              </Text>
              :
              <Text>
                ... Null
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
          <View style={[globalStyles.bevLine, {
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
                  bevButtonPressed={this.props.closePurchaseRoute}
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
        <View style={globalStyles.bevLine}>
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
              bevButtonPressed={this.props.closePurchaseRoute}
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

interface Style {
  numBeersContainer: React.ViewStyle;
  numBeersButtonContainer: React.ViewStyle;
  numBeersButton: React.ViewStyle;
  numBeersButtonText: React.TextStyle;
}

const styles = StyleSheet.create<Style>({
  numBeersContainer: {
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
