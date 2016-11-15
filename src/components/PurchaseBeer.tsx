import * as React from "react";
import { Component, PropTypes } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { CardResponseData, PurchaseData, PurchaseState } from '../reducers/purchase';

import StatusLine from './StatusLine';
import RouteWithNavBarWrapper from './RouteWithNavBarWrapper';
import TitleText from './TitleText';
import BevButton from './BevButton';

import {globalColors, globalStyles} from './GlobalStyles';

interface PurchaseBeerProps {
  fullName: string;
  firstName: string;
  purchase: PurchaseState;
  creditCards: CardResponseData[];
  activeCard: string;
  attemptingUpdate: boolean;
  attemptingVerification: boolean;
  resetPurchase();
  closePurchaseRoute();
  startCreditCardPurchase(PurchaseData);
  goToAddCreditCardRoute();
  removeCard(id, index): void;
  updateDefaultCard(newDefaultCardId): void;
}

interface PurchaseBeerState {
  numDrinks: number;
  couponCode: string;
}

export default class PurchaseBeer extends Component<PurchaseBeerProps, PurchaseBeerState> {

  constructor(props){
    super(props);
    this.state = {
      numDrinks: 1,
      couponCode: "",
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

  updateState(property, value){
    this.setState(function(prevState, currentProps){
      let nextState = Object.assign({}, prevState);
      nextState[property] = value;
      return nextState;
    });
  }

  purchaseDrink() {
    if(this.props.creditCards.length === 0){
      alert("Please Add a Credit Card!");
      return;
    }
    this.props.startCreditCardPurchase({
      // Stripe likes the amount to be cents.
      amount: this.state.numDrinks * 100 * this.props.purchase.pricePerDrink,
      description: `Sending ${this.state.numDrinks} Bevegram${this.state.numDrinks > 1 ? "s" : ""} to ${this.props.fullName}`
    })
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
              <Text style={globalStyles.bevLineTextTitle}>Coupon:</Text>
            </View>
            <View style={globalStyles.bevLineRight}>
              <View style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
                <TextInput
                  style={{
                    width: 65,
                    textAlign: 'center',
                    height: 40,
                  }}
                  ref="couponInput"
                  maxLength={4}
                  placeholder={"ABCD"}
                  placeholderTextColor={"#cccccc"}
                  onChangeText={(text) => {
                    this.updateState("couponCode", text);
                  }}
                />
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
          {this.props.creditCards ? this.props.creditCards.map((card, index) => {
            return (
              <View style={globalStyles.bevLine} key={card.id}>
                <TouchableOpacity
                  onPress={() => {
                    if(!this.props.attemptingUpdate
                       && this.props.creditCards.length > 1
                       && card.id !== this.props.activeCard
                      ){
                      this.props.updateDefaultCard(card.id);
                    }
                  }}
                  style={[globalStyles.bevLineLeft, {
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                }]}>
                  <View
                    style={{
                    paddingRight: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: -1,
                    marginTop: 4,
                  }}>
                    {this.props.attemptingUpdate ?
                        <ActivityIndicator style={{height: 28, width: 28}} />
                    :
                      card.id === this.props.activeCard ?
                        <FontAwesome
                          name="check-square-o"
                          size={25}
                          color="green"
                          style={{
                            flex: -1,
                            width: 28,
                            height: 28,
                          }}
                        />
                      :
                        <FontAwesome
                          name="square-o"
                          size={25}
                          color="#999"
                          style={{
                            flex: -1,
                            width: 28,
                            height: 28,
                          }}
                        />
                    }
                  </View>
                  <View style={{flex: -1, flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesome name={"cc-" + card.brand.toLowerCase()} size={30} style={{paddingRight: 10}}/>
                    <Text style={globalStyles.bevLineText}>.... {card.last4}</Text>
                  </View>
                </TouchableOpacity>
                <View style={globalStyles.bevLineRight}>
                  <TouchableOpacity
                    onPress={() => {
                      if(!this.props.attemptingUpdate){
                        this.props.removeCard(card.id, index);
                      }
                    }}
                    style={{
                      flex: 1,
                      justifyContent: 'center'
                    }}>
                    <Text style={{color: '#999'}}>{this.props.attemptingUpdate ? "Updating..." : "Remove"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }) : <View/>}
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
              <View style={[globalStyles.bevLineLeft, {flex: 2}]}>
                <Text
                  style={[globalStyles.bevLineTextTitle, {
                    fontWeight: "normal"
                  }]}>
                  {this.props.attemptingVerification ?
                    "Adding Credit Card..."
                    :
                    "Add Credit Card"
                  }
                </Text>
              </View>
              <View style={globalStyles.bevLineRight}>
                <Ionicon name="ios-arrow-forward" size={35} />
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
              {this.props.creditCards.length === 0 ?
                <BevButton
                  bevButtonPressed={this.props.goToAddCreditCardRoute}
                  buttonText={"Add Credit Card"}
                  buttonFontSize={20}
                  rightIcon={true}
                />
              :
                <BevButton
                  bevButtonPressed={this.purchaseDrink.bind(this)}
                  buttonText={"Confirm Purchase"}
                  buttonFontSize={20}
                />
              }
            </View>
          </View>
          <View style={{height: 20}}></View>
        </View>
      </RouteWithNavBarWrapper>
    );
  }

  renderPurchaseAttempting(){
    let card;
    for(const i in this.props.creditCards){
      if(this.props.activeCard === this.props.creditCards[i].id){
        card = this.props.creditCards[i];
      }
    }
    const cardBrandIcon = (card && card.brand) ? "cc-" + card.brand.toLowerCase() : "question";
    const cardNumber = (card && card.last4) ? card.last4 : "Not Found";
    return (
      <RouteWithNavBarWrapper>
        <View style={globalStyles.bevContainer}>
          <View style={globalStyles.bevLine}>
            <Text>
              Sending {this.state.numDrinks} {this.state.numDrinks > 1 ? "Beers" : "Beer"} to {this.props.firstName}!
            </Text>
          </View>
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>Card Used:</Text>
            </View>
            <View style={globalStyles.bevLineRight}>
              <View style={{flex: -1, flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesome name={cardBrandIcon} size={30} style={{paddingRight: 10}}/>
                <Text style={globalStyles.bevLineText}>.... {cardNumber}</Text>
              </View>
            </View>
          </View>
          <StatusLine
            title="Verify Purchase"
            input={this.props.purchase.confirmed}
            waiting={false}
            allFailed={this.props.purchase.failed}
          />
          {this.props.purchase.failed ?
          <View>
            <View style={globalStyles.bevLineNoSep}>
              <Text style={[globalStyles.bevLineTextTitle, {color: 'red'}]}>Purchase Error:</Text>
            </View>
            <View style={globalStyles.bevLine}>
              <Text style={globalStyles.bevLineText}numberOfLines={5}>{this.props.purchase.failMessage}</Text>
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
      </RouteWithNavBarWrapper>
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
    if(this.props.purchase.attemptingPurchase){
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
