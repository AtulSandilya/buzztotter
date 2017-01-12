import * as React from "react";
import { Component, PropTypes } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {isIOS, WindowWidth} from '../Utilities';

import { CreditCard, PurchaseData, PurchaseState, PurchasePackage} from '../reducers/purchase';

import {SendBevegramData} from '../sagas/sendBevegram';
import {InProgressData} from './PurchaseAndOrSendInProgress';

import StatusLine from './StatusLine';
import RouteWithNavBarWrapper from './RouteWithNavBarWrapper';
import TitleText from './TitleText';
import BevButton, {getButtonHeight} from './BevButton';

import {globalColors, globalStyles, BevLayoutAnimation} from './GlobalStyles';

export const FormatCreditCardBrandForFontAwesomeIcon = (card: CreditCard) => {
  const cardMap = {
    "Visa": "visa",
    "MasterCard": "mastercard",
    "American Express": "amex",
    "Discover": "discover",
    "JCB": "jcb",
    "Diners Club": "diners-club",
  }

  const cardPrefix = "cc-"

  if(card && cardMap[card.brand]){
    return cardPrefix + cardMap[card.brand];
  }

  return "credit-card";
}

interface PurchaseBevegramProps {
  userBevegrams: number;
  fullName: string;
  firstName: string;
  imageUri: string;
  facebookId: string;
  purchase: PurchaseState;
  creditCards: CreditCard[];
  activeCardId: string;
  attemptingUpdate: boolean;
  attemptingVerification: boolean;
  purchasePackages: PurchasePackage[];
  selectedPurchasePackage: PurchasePackage;
  selectedPurchasePackageIndex: number;
  attemptingSend: boolean;
  completedSend: boolean;
  resetPurchase();
  closePurchaseRoute();
  goToAddCreditCardRoute();
  removeCard(id, index): void;
  updateDefaultCard(newDefaultCardId): void;
  selectPackage(packageId): void;
  startCreditCardPurchase(PurchaseData, InProgressData): void;
  sendBevegram(SendBevegramData, InProgressData): void;
  purchaseAndSend(PurchaseData, SendBevegramData, InProgressData): void;
}

interface PurchaseBevegramState {
  promoCode: string;
  message: string;
  bevegramsToSend: number;
  // Track the number of userBevegrams when this component is rendered. Allows
  // userBevegrams to change (which it does after a purchase and a send) but
  // base the view logic on the initial userBevegram count.
  bevegramsBeforePurchaseOrSendOrBoth: number;
}

export default class PurchaseBevegram extends Component<PurchaseBevegramProps, PurchaseBevegramState> {

  constructor(props){
    super(props);
    this.state = {
      promoCode: "",
      message: "",
      bevegramsToSend: 1,
      bevegramsBeforePurchaseOrSendOrBoth: this.props.userBevegrams,
    };
  }

  buttonFontSize = 20;

  componentWillUpdate() {
    BevLayoutAnimation();
  }

  userIsSending(): boolean {
    return this.props.fullName !== undefined;
  }

  userIsPurchasing(): boolean {
    if(!this.userIsSending()) return true;
    return (this.state.bevegramsToSend > this.state.bevegramsBeforePurchaseOrSendOrBoth);
  }

  userIsPurchasingAndSending(): boolean {
    return this.userIsPurchasing() && this.userIsSending();
  }

  updateBevegramsToSend(amount){
    const min = 1;
    const userBevs = this.props.userBevegrams;
    const packagesMax = this.props.purchasePackages.slice(-1)[0].quantity;
    const max = packagesMax + userBevs;
    const newAmount = this.state.bevegramsToSend + amount;
    const bevsToSend = this.state.bevegramsToSend;
    const packageIndex = this.props.selectedPurchasePackageIndex;
    const packages = this.props.purchasePackages;

    if(newAmount <= max && newAmount >= min){
      this.updateState("bevegramsToSend", newAmount);


      // Automatically select the purchasePackage that is equal to or above
      // the users Bevegrams
      const bevsUserMustPurchase = (bevsToSend + amount) - userBevs;
      if(bevsToSend > userBevs){
        if(amount > 0){
          if(packageIndex + 1 !== packages.length
            && bevsUserMustPurchase > packages[packageIndex].quantity){
            this.props.selectPackage(packageIndex + 1);
          }
        }

        if(amount < 0){
          if(packageIndex > 0
            && (bevsUserMustPurchase <= packages[packageIndex - 1].quantity)){
            this.props.selectPackage(packageIndex - 1);
          }
        }
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
    // Warn the user if the package they are choosing is smaller than the
    // number of bevegrams they want to send
    const newPack = this.props.purchasePackages[newSelectedPurchasePackageIndex];
    if(newPack.quantity < (this.props.userBevegrams + this.state.bevegramsToSend)){
      alert("This package is too small!");
      return;
    }

    this.props.selectPackage(newSelectedPurchasePackageIndex);
  }

  initiatePurchaseOrSendOrBoth() {
    if(this.userIsPurchasing()){
      if(this.props.creditCards.length === 0){
        alert("Please Add a Credit Card!");
        return;
      }
    }

    if(this.userIsPurchasingAndSending()){
      this.props.purchaseAndSend(this.packPurchaseData(), this.packSendData(), this.packInProgressData());
    } else if(this.userIsPurchasing()){
      this.props.startCreditCardPurchase(this.packPurchaseData(), this.packInProgressData());
    } else if(this.userIsSending()){
      this.props.sendBevegram(this.packSendData(), this.packInProgressData());
    }
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
      facebookId: this.props.facebookId,
      quantity: this.state.bevegramsToSend,
      message: this.state.message,
    }
  }

  packInProgressData(): InProgressData {
    const activeCard = this.getActiveCard();
    return {
      recipentImage: this.props.imageUri,
      bevegramsUserIsSending: this.state.bevegramsToSend,
      bevegramsUserIsPurchasing: this.packPurchaseData().quantity,
      bevegramsPurchasePrice: this.props.selectedPurchasePackage.price.toFixed(2),
      cardLast4: activeCard.last4,
      cardFontAwesomeIcon: FormatCreditCardBrandForFontAwesomeIcon(activeCard),
      userIsPurchasing: this.userIsPurchasing(),
      userIsSending: this.userIsSending(),
      recipentFullName: this.props.fullName,
      buttonFontSize: this.buttonFontSize,
    }
  }

  getActiveCard(){
    // Is this a bad idea?
    let activeCard: CreditCard = {
      token: undefined,
      brand: undefined,
      last4: undefined,
      id: undefined,
    };

    this.props.creditCards.map((card) => {
      if(card.id === this.props.activeCardId){
        activeCard = card;
      }
    });

    return activeCard;
  }

  renderSendOptions() {
    if(!this.userIsSending()){
      return null;
    }

    return (
      <View style={{flex: 1}}>
        <View style={globalStyles.bevLine}>
          <View style={globalStyles.bevLineLeft}>
            <Text style={globalStyles.bevLineTextTitle}>Receipent:</Text>
          </View>
          <View style={globalStyles.bevLineRight}>
            <Image
              source={{uri: this.props.imageUri}}
              style={{
                height: 40,
                width: 40,
                marginRight: 10,
              }}
            />
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
              <TouchableHighlight
                underlayColor={"transparent"}
                onPress={() => this.increaseBevegramsToSend()}
                hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                style={{marginLeft: 15}}>
                  <FontAwesome
                    name="plus-circle"
                    style={globalStyles.bevIcon}
                    color="#555555"
                    size={28}
                  />
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={"transparent"}
                onPress={() => this.decreaseBevegramsToSend()}
                hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                style={{marginLeft: 15}}>
                <FontAwesome
                  name="minus-circle"
                  style={globalStyles.bevIcon}
                  color="#555555"
                  size={28}
                />
              </TouchableHighlight>
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

  renderPurchaseOptions() {
    if(!this.userIsPurchasing()){
      return null;
    }

    return (
      <View style={{flex: 1}}>
        <View style={globalStyles.bevLineNoSepWithMargin}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>
                Purchase Bevegrams:
              </Text>
            </View>
          </View>
        </View>
        {this.props.purchasePackages.map((pack, index) => {
          return (
            <TouchableHighlight
              underlayColor={"transparent"}
              style={globalStyles.bevLine}
              key={"package" + index}
              onPress={this.onSelectPackage.bind(this, index)}
            >
              <View style={{flex: 1, flexDirection: 'row'}}>
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
              </View>
            </TouchableHighlight>
          )
        })}
        <View style={globalStyles.bevLine}>
          <View style={globalStyles.bevLineLeft}>
            <Text style={globalStyles.bevLineTextTitle}>Promo Code:</Text>
          </View>
          <View style={globalStyles.bevLineRight}>
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
        {this.props.creditCards ? this.props.creditCards.map((card, index) => {
          return (
            <View style={globalStyles.bevLine} key={card.id}>
              <TouchableHighlight
                underlayColor={"transparent"}
                onPress={() => {
                  if(!this.props.attemptingUpdate
                     && this.props.creditCards.length > 1
                     && card.id !== this.getActiveCard().id
                    ){
                    this.props.updateDefaultCard(card.id);
                  }
                }}
                style={[globalStyles.bevLineLeft, {
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
              }]}>
                <View style={{flex: -1, flexDirection: 'row'}}>
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
                      card.id === this.getActiveCard().id ?
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
                </View>
              </TouchableHighlight>
              <View style={globalStyles.bevLineRight}>
                <TouchableHighlight
                underlayColor={"transparent"}
                  onPress={() => {
                    if(!this.props.attemptingUpdate){
                      this.props.removeCard(card.id, index);
                    }
                  }}
                  style={{
                    paddingRight: 10,
                  }}>
                  <Text style={{color: '#999'}}>{this.props.attemptingUpdate ? "Updating..." : "Remove"}</Text>
                </TouchableHighlight>
              </View>
            </View>
          )
        }) : <View/>}
        <View style={[globalStyles.bevLineNoSepWithMargin]}>
          <TouchableHighlight
            underlayColor={"transparent"}
            style={{
              flex: 1,
              flexDirection: 'row',
            }}
            onPress={() => {
              this.props.goToAddCreditCardRoute();
            }}
          >
            <View style={{flex: 1, flexDirection: 'row'}}>
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
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  renderSendAndPurchaseOptions(){
    const listFlex = 1;
    const bottomButtonFlex = -1;
    let buttonText: string;
    const purchaseText = "Purchase";
    const sendText = "Send";
    if(this.userIsPurchasingAndSending()){
      buttonText = `${purchaseText} & ${sendText}`
    } else if (this.userIsPurchasing()){
      buttonText = purchaseText;
    } else if (this.userIsSending()){
      buttonText = sendText;
    }
    const purchaseButtonIcon = this.userIsPurchasing() ?
      FormatCreditCardBrandForFontAwesomeIcon(this.getActiveCard())
      : "paper-plane";
    const viewBelowHeight = getButtonHeight(this.buttonFontSize);

    return(
      <View style={{flex: 1}}>
        <View style={{flex: listFlex, backgroundColor: "#ffffff"}}>
          <RouteWithNavBarWrapper
            viewBelowHeight={viewBelowHeight}
          >
            <View style={[globalStyles.bevContainer]}>
              {this.renderSendOptions()}
              {this.renderPurchaseOptions()}
              {/* Add empty view to ensure elements above are viewable */}
              <View style={{height: viewBelowHeight + 20, width: WindowWidth}}></View>
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
                  text={this.userIsPurchasingAndSending() ? "" : "Cancel"}
                  shortText={""}
                  fontAwesomeLeftIcon="ban"
                  label="Cancel Purchase Button"
                  buttonFontSize={this.buttonFontSize}
                  margin={0}
                />
              </View>
              <View style={globalStyles.bevLineRight}>
                <BevButton
                  onPress={this.initiatePurchaseOrSendOrBoth.bind(this)}
                  text={buttonText}
                  shortText={buttonText}
                  label={buttonText + " Button"}
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

  render() {
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
