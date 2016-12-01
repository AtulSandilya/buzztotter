import * as React from "react";
import { Component, PropTypes } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {isIOS} from '../Utilities';

import { CardResponseData, PurchaseData, PurchaseState, PurchasePackage} from '../reducers/purchase';

import {SendBevegramData} from '../sagas/sendBevegram';

import StatusLine from './StatusLine';
import RouteWithNavBarWrapper from './RouteWithNavBarWrapper';
import TitleText from './TitleText';
import BevButton, {getButtonHeight} from './BevButton';

import {globalColors, globalStyles} from './GlobalStyles';

interface PurchaseBevegramProps {
  userBevegrams: number;
  fullName: string;
  firstName: string;
  purchase: PurchaseState;
  creditCards: CardResponseData[];
  activeCard: string;
  attemptingUpdate: boolean;
  attemptingVerification: boolean;
  purchasePackages: PurchasePackage[];
  selectedPurchasePackage: PurchasePackage;
  selectedPurchasePackageIndex: number;
  attemptingSend: boolean;
  completedSend: boolean;
  resetPurchase();
  closePurchaseRoute();
  startCreditCardPurchase(PurchaseData);
  goToAddCreditCardRoute();
  removeCard(id, index): void;
  updateDefaultCard(newDefaultCardId): void;
  selectPackage(packageId): void;
  sendBevegram(SendBevegramData): void;
  purchaseAndSend(PurchaseData, SendBevegramData): void;
}

interface PurchaseBevegramState {
  promoCode: string;
  bevegramsToSend: number;
  showPurchaseOptions: boolean;
  message: string;
  userDidSelectPackage: boolean;
}


export default class PurchaseBevegram extends Component<PurchaseBevegramProps, PurchaseBevegramState> {

  constructor(props){
    super(props);
    this.state = {
      promoCode: "",
      bevegramsToSend: 1,
      showPurchaseOptions: this.props.userBevegrams === 0,
      message: "",
      userDidSelectPackage: false,
    };
  }

  buttonFontSize = 20;

  userIsPurchasing(): boolean {
    return (this.state.bevegramsToSend > this.props.userBevegrams) || this.state.userDidSelectPackage;
  }

  updateBevegramsToSend(amount){
    const min = 1;
    const userBevs = this.props.userBevegrams;
    const packagesMax = this.props.purchasePackages.slice(-1)[0].quantity;
    const max = packagesMax > userBevs ? packagesMax : userBevs;
    const newAmount = this.state.bevegramsToSend + amount;

    if(newAmount <= max && newAmount >= min){
      this.updateState("bevegramsToSend", newAmount);

      const bevsToSend = this.state.bevegramsToSend;
      const packageIndex = this.props.selectedPurchasePackageIndex;
      const packages = this.props.purchasePackages;

      // Automatically select the purchasePackage that is equal to or above
      // the users Bevegrams
      if(bevsToSend > userBevs){
        this.updateState("showPurchaseOptions", true);
        if(amount > 0){
          if(packageIndex + 1 !== packages.length
            && bevsToSend >= packages[packageIndex].quantity){
            this.props.selectPackage(packageIndex + 1);
          }
        }

        if(amount < 0){
          if(packageIndex > 0
            && bevsToSend === packages[packageIndex - 1].quantity + 1){
            this.props.selectPackage(packageIndex - 1);
          }
        }
      } else {
        this.updateState("showPurchaseOptions", false);
      }
    }
  }

  increaseBevegramsToSend(){
    this.updateBevegramsToSend(1);
  }

  decreaseBevegramsToSend(){
    this.updateBevegramsToSend(-1);
  }

  updateState(property, value){
    this.setState(function(prevState, currentProps){
      let nextState = Object.assign({}, prevState);
      nextState[property] = value;
      return nextState;
    });
  }

  onSelectPackage(newSelectedPurchasePackageIndex){
    if((this.props.userBevegrams > this.state.bevegramsToSend) && (newSelectedPurchasePackageIndex === this.props.selectedPurchasePackageIndex) && this.state.userDidSelectPackage){
      this.updateState("userDidSelectPackage", false);
      return;
    }
    this.updateState("userDidSelectPackage", true);

    this.props.selectPackage(newSelectedPurchasePackageIndex);
  }

  purchaseDrink() {
    if(this.props.creditCards.length === 0){
      alert("Please Add a Credit Card!");
      return;
    }

    if(this.userIsPurchasing()){
      this.props.purchaseAndSend(this.packPurchaseData(), this.packSendData());
    } else {
      this.props.sendBevegram(this.packSendData());
    }

    // this.props.startCreditCardPurchase({
    //   // Stripe likes the amount to be cents.
    //   amount: pack.price * 100,
    //   description: `Purchased ${pack.quantity} Bevegram${pack.quantity > 1 ? "s" : ""} via Buzz Otter`,
    //   quantity: pack.quantity,
    // })
  }

  packPurchaseData(): PurchaseData {
    const pack = this.props.selectedPurchasePackage;
    return {
      amount: pack.price * 100,
      description: `Purchased ${pack.quantity} Bevegram${pack.quantity > 1 ? "s" : ""} via Buzz Otter`,
      quantity: pack.quantity,
    }
  }

  packSendData(): SendBevegramData {
    return {
      recipentName: this.props.fullName,
      quantity: this.state.bevegramsToSend,
      message: this.state.message,
    }
  }

  getBrandOfActiveCard(){
    let activeCardBrand = "";

    this.props.creditCards.map((card) => {
      if(card.id === this.props.activeCard){
        activeCardBrand = card.brand;
      }
    });

    if(activeCardBrand.length !== 0){
      return "cc-" + activeCardBrand.toLowerCase();
    }

    // Show some icon if active card is not found
    return "credit-card";
  }

  renderSendOptions() {
    return (
      <View style={{flex: 1}}>
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
            <Text style={globalStyles.bevLineTextTitle}>Bevegrams:</Text>
          </View>
          <View style={globalStyles.bevLineRight}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
              <Text style={globalStyles.bevLineTextTitle}>{this.state.bevegramsToSend}</Text>
              <TouchableOpacity
                onPress={() => this.increaseBevegramsToSend()}
                hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                style={{marginLeft: 15}}>
                  <FontAwesome
                    name="plus-circle"
                    style={globalStyles.bevIcon}
                    color="#555555"
                    size={28}
                  />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.decreaseBevegramsToSend()}
                hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                style={{marginLeft: 15}}>
                <FontAwesome
                  name="minus-circle"
                  style={globalStyles.bevIcon}
                  color="#555555"
                  size={28}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={globalStyles.bevLineNoSep}>
          <Text style={globalStyles.bevLineTextTitle}>Message:</Text>
          <Text style={globalStyles.bevLineText}> (Optional)</Text>
        </View>
        <View style={globalStyles.bevLine}>
          <TextInput
            placeholder={"Happy Birthday! Have a cold one on me!"}
            placeholderTextColor={"#cccccc"}
            style={{
              flex: 1,
              height: 45,
            }}
            onChangeText={(text) => {
              this.updateState("message", text);
            }}
          />
        </View>
      </View>
    )
  }

  renderTogglePurchaseLine() {
    const allowToggling = this.props.userBevegrams > this.state.bevegramsToSend;
    return (
      <View style={{flex: 1}}>
        <TouchableHighlight
          style={this.state.showPurchaseOptions ? globalStyles.bevLineNoSepWithMargin : globalStyles.bevLine}
          underlayColor={"#ffffff"}
          onPress={() => {
            if(allowToggling){
              this.updateState("showPurchaseOptions", !this.state.showPurchaseOptions);
            }
          }}
        >
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>
                Purchase Bevegrams:
              </Text>
            </View>
            {allowToggling ?
              <View style={globalStyles.bevLineRight}>
                {this.state.showPurchaseOptions ?
                  <Ionicon
                    name={(isIOS ? "ios-" : "md-") + "arrow-dropdown"}
                    size={25}
                    color="#999"
                    style={globalStyles.bevIcon}
                  />
                  :
                  <Ionicon
                    name={(isIOS ? "ios-" : "md-") + "arrow-dropleft"}
                    size={25}
                    color="#999"
                    style={globalStyles.bevIcon}
                  />
                }
              </View>
            :
              null }
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  renderPurchaseOptions() {
    if(!this.state.showPurchaseOptions){
      return null;
    }

    return (
      <View style={{flex: 1}}>
        {this.props.purchasePackages.map((pack, index) => {
          return (
            <TouchableOpacity
              style={globalStyles.bevLine}
              key={"package" + index}
              onPress={this.onSelectPackage.bind(this, index)}
            >
              <View style={[globalStyles.bevLineLeft, {flexDirection: 'row'}]}>
                {(this.props.selectedPurchasePackageIndex === index) && this.userIsPurchasing() ?
                  <FontAwesome
                    name="check-square-o"
                    color="green"
                    size={25}
                    style={globalStyles.bevIcon}
                  />
                :
                  <FontAwesome
                    name="square-o"
                    size={25}
                    color="#999"
                    style={globalStyles.bevIcon}
                  />
                }
                <Text style={globalStyles.bevLineTextTitle}>
                  {pack.name}
                </Text>
              </View>
              <View style={globalStyles.bevLineRight}>
                <Text style={globalStyles.bevLineText}>$ {pack.price.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
        <View style={globalStyles.bevLine}>
          <View style={globalStyles.bevLineLeft}>
            <Text style={globalStyles.bevLineTextTitle}>Promo Code:</Text>
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
                ref="promoCodeInput"
                maxLength={4}
                placeholder={"ABCD"}
                placeholderTextColor={"#cccccc"}
                onChangeText={(text) => {
                  this.updateState("promoCode", text);
                }}
              />
            </View>
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
                        style={globalStyles.bevIcon}
                      />
                    :
                      <FontAwesome
                        name="square-o"
                        size={25}
                        color="#999"
                        style={globalStyles.bevIcon}
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
      </View>
    )
  }

  renderSendAndPurchaseOptions(){
    const listFlex = 1;
    const bottomButtonFlex = -1;
    const purchaseButtonText = this.userIsPurchasing() ? "Purchase & Send" : "Send";
    const purchaseButtonIcon = this.userIsPurchasing() ? this.getBrandOfActiveCard() : "paper-plane"

    return(
      <View style={{flex: 1}}>
        <View style={{flex: listFlex, backgroundColor: "#ffffff"}}>
          <RouteWithNavBarWrapper
            viewBelowHeight={getButtonHeight(this.buttonFontSize) + 10}
          >
            <View style={[globalStyles.bevContainer, {paddingBottom: 0}]}>
              {this.renderSendOptions()}
              {this.renderTogglePurchaseLine()}
              {this.renderPurchaseOptions()}
            </View>
          </RouteWithNavBarWrapper>
        </View>
        <View style={{
          flex: bottomButtonFlex,
          shadowColor: '#333333',
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 15,
          zIndex: 1,
          backgroundColor: '#ffffff',
        }}>
          <View style={[globalStyles.bevContainer, {flex: -1, margin: 0, paddingVertical: 10, paddingHorizontal: 10}]}>
            <View style={[globalStyles.bevLineNoSep, {height: getButtonHeight(this.buttonFontSize), paddingBottom: 0, alignItems: 'center', justifyContent: 'center'}]}>
              <View style={[globalStyles.bevLineLeft]}>
                <BevButton
                  onPress={this.props.closePurchaseRoute}
                  text={this.userIsPurchasing() ? "" : "Cancel"}
                  shortText={""}
                  fontAwesomeLeftIcon="ban"
                  label="Cancel Purchase Button"
                  buttonFontSize={this.buttonFontSize}
                  margin={0}
                />
              </View>
              <View style={globalStyles.bevLineRight}>
                <BevButton
                  onPress={this.purchaseDrink.bind(this)}
                  text={purchaseButtonText}
                  shortText={purchaseButtonText}
                  label={purchaseButtonText + " Button"}
                  buttonFontSize={this.buttonFontSize}
                  fontAwesomeLeftIcon={purchaseButtonIcon}
                  margin={0}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderAttemptingPurchaseAndOrSend(){
    let card;
    for(const i in this.props.creditCards){
      if(this.props.activeCard === this.props.creditCards[i].id){
        card = this.props.creditCards[i];
      }
    }
    const cardBrandIcon = (card && card.brand) ? "cc-" + card.brand.toLowerCase() : "question";
    const cardNumber = (card && card.last4) ? card.last4 : "Not Found";

    let beersToSend = 1;

    return (
      <RouteWithNavBarWrapper>
        <View style={globalStyles.bevContainer}>
          <View style={globalStyles.bevLine}>
            <Text>
              Sending {beersToSend} {beersToSend > 1 ? "Beers" : "Beer"} to {this.props.firstName}!
            </Text>
          </View>
          {this.userIsPurchasing() ?
            <View style={{flex: 1}}>
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
            </View>
          :
            null
          }
          <StatusLine
            title="Sending Bevegram"
            input={this.props.completedSend ? true : undefined}
            waiting={!this.userIsPurchasing() ? false : !this.props.purchase.confirmed}
            allFailed={false}
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
                    onPress={this.props.closePurchaseRoute}
                    text={"Close"}
                    shortText="Close"
                    label="Close Purchase Button"
                    buttonFontSize={this.buttonFontSize}
                  />
                </View>
                <View style={{flex: 1, alignItems: 'flex-end', paddingTop: 10}}>
                  <BevButton
                    onPress={this.props.resetPurchase}
                    text={"Try Again"}
                    shortText={"Try Again"}
                    label={"Try Purchase Again Button"}
                    buttonFontSize={this.buttonFontSize}
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
    if(this.props.purchase.confirmed || this.props.completedSend){
      return (
      <View>
        <View style={globalStyles.bevLine}>
          <View style={{flex: 1}}>
            <Text
              style={{
                fontWeight: 'bold',
              }}
            >
              {this.state.bevegramsToSend} {this.state.bevegramsToSend > 1 ? "Beers" : "Beer"} sent to {this.props.firstName}!
            </Text>
          </View>
        </View>
        <View>
          <View style={{alignItems: 'flex-end', paddingTop: 10}}>
            <BevButton
              onPress={this.props.closePurchaseRoute}
              text={"Close"}
              shortText={"Close"}
              label="Close Purchase Button"
              buttonFontSize={this.buttonFontSize}
            />
          </View>
        </View>
      </View>
      )
    }
    return <View/>
  }

  render() {
    if(this.props.purchase.attemptingPurchase || this.props.attemptingSend){
      return this.renderAttemptingPurchaseAndOrSend();
    }

    return this.renderSendAndPurchaseOptions();
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
  },
  numBeersButtonContainer: {
    flex: -1,
    flexDirection: 'row',
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
