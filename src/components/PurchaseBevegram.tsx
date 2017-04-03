import * as React from "react";
import { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";

import {isIOS, WindowWidth} from "../Utilities";

import {
  CreditCard,
  PurchaseData,
  PurchasePackage,
  PurchaseState,
} from "../reducers/purchase";

import {SendBevegramData} from "../sagas/sendBevegram";
import {InProgressData} from "./PurchaseAndOrSendInProgress";

import BevButton, {getButtonHeight} from "./BevButton";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";
import StatusLine from "./StatusLine";
import TitleText from "./TitleText";

import {
  BevLayoutAnimation,
  globalColors,
  globalStyles,
} from "./GlobalStyles";

export const FormatCreditCardBrandForFontAwesomeIcon = (card: CreditCard) => {
  const cardMap = {
    "American Express": "amex",
    "Diners Club": "diners-club",
    "Discover": "discover",
    "JCB": "jcb",
    "MasterCard": "mastercard",
    "Visa": "visa",
  };

  const cardPrefix = "cc-";

  if (card && cardMap[card.brand]) {
    return cardPrefix + cardMap[card.brand];
  }

  return "credit-card";
};

interface PurchaseBevegramProps {
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
}

export default class PurchaseBevegram extends Component<PurchaseBevegramProps, PurchaseBevegramState> {

  public buttonFontSize = 20;

  constructor(props) {
    super(props);
    this.state = {
      bevegramsToSend: this.props.selectedPurchasePackage.quantity,
      message: "",
      promoCode: "",
    };
  }

  public render() {
    return this.renderSendAndPurchaseOptions();
  }

  private componentWillUpdate() {
    BevLayoutAnimation();
  }

  private userIsSending(): boolean {
    // return this.props.fullName !== undefined;
    return true;
  }

  private userIsPurchasing(): boolean {
    // if(!this.userIsSending()) return true;
    // return (this.state.bevegramsToSend > this.state.bevegramsBeforePurchaseOrSendOrBoth);
    return true;
  }

  private userIsPurchasingAndSending(): boolean {
    return this.userIsPurchasing() && this.userIsSending();
  }

  private updateBevegramsToSend(amount) {
    this.updateState("bevegramsToSend", amount);
  }

  private increaseBevegramsToSend() {
    this.updateBevegramsToSend(1);
  }

  private decreaseBevegramsToSend() {
    this.updateBevegramsToSend(-1);
  }

  private updateState(property, value) {
    this.setState((prevState, currentProps) => {
      const nextState = Object.assign({}, prevState);
      nextState[property] = value;
      return nextState;
    });
  }

  private onSelectPackage(newSelectedPurchasePackageIndex) {
    const newPack = this.props.purchasePackages[newSelectedPurchasePackageIndex];

    this.props.selectPackage(newSelectedPurchasePackageIndex);
    this.updateBevegramsToSend(newPack.quantity);
  }

  private initiatePurchaseOrSendOrBoth() {
    if (this.userIsPurchasing()) {
      if (this.props.creditCards.length === 0) {
        alert("Please Add a Credit Card!");
        return;
      }
    }

    if (this.userIsPurchasingAndSending()) {
      this.props.purchaseAndSend(this.packPurchaseData(), this.packSendData(), this.packInProgressData());
    } else if (this.userIsPurchasing()) {
      this.props.startCreditCardPurchase(this.packPurchaseData(), this.packInProgressData());
    } else if (this.userIsSending()) {
      this.props.sendBevegram(this.packSendData(), this.packInProgressData());
    }
  }

  private packPurchaseData(): PurchaseData {
    const pack = this.props.selectedPurchasePackage;
    return {
      amount: pack.price * 100,
      description: `Purchased ${pack.quantity} Bevegram${pack.quantity > 1 ? "s" : ""} via Buzz Otter`,
      promoCode: this.state.promoCode,
      quantity: pack.quantity,
    };
  }

  private packSendData(): SendBevegramData {
    return {
      facebookId: this.props.facebookId,
      message: this.state.message,
      quantity: this.state.bevegramsToSend,
      recipentName: this.props.fullName,
    };
  }

  private packInProgressData(): InProgressData {
    const activeCard = this.getActiveCard();
    return {
      bevegramsPurchasePrice: this.props.selectedPurchasePackage.price.toFixed(2),
      bevegramsUserIsPurchasing: this.packPurchaseData().quantity,
      bevegramsUserIsSending: this.state.bevegramsToSend,
      buttonFontSize: this.buttonFontSize,
      cardFontAwesomeIcon: FormatCreditCardBrandForFontAwesomeIcon(activeCard),
      cardLast4: activeCard.last4,
      recipentFullName: this.props.fullName,
      recipentImage: this.props.imageUri,
      userIsPurchasing: this.userIsPurchasing(),
      userIsSending: this.userIsSending(),
    };
  }

  private getActiveCard() {
    // Is this a bad idea?
    let activeCard: CreditCard = {
      brand: undefined,
      id: undefined,
      last4: undefined,
      token: undefined,
    };

    this.props.creditCards.map((card) => {
      if (card.id === this.props.activeCardId) {
        activeCard = card;
      }
    });

    return activeCard;
  }

  private renderBevegramsIncreaseDecreaseLine() {
    return (
      <View style={globalStyles.bevLine}>
        <View style={globalStyles.bevLineLeft}>
          <Text style={globalStyles.bevLineTextTitle}>Bevegrams:</Text>
        </View>
        <View style={globalStyles.bevLineRight}>
          <View style={{
            alignItems: "center",
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
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
    );
  }

  private renderSendOptions() {
    if (!this.userIsSending()) {
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
                marginRight: 10,
                width: 40,
              }}
            />
            <Text style={globalStyles.bevLineText}>{this.props.fullName}</Text>
          </View>
        </View>
      </View>
    );
  }

  private renderPurchasePackages() {
    return (
      this.props.purchasePackages.map((pack, index) => {
        return (
          <TouchableHighlight
            underlayColor={"transparent"}
            style={globalStyles.bevLine}
            key={"package" + index}
            onPress={this.onSelectPackage.bind(this, index)}
          >
            <View style={{flex: 1, flexDirection: "row"}}>
              <View style={[globalStyles.bevLineLeft, {flexDirection: "row"}]}>
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
        );
      })
    );
  }

  private renderMessageLine() {
    return (
      <View style={{flex: 1}}>
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
    );
  }

  private renderPurchaseOptions() {
    if (!this.userIsPurchasing()) {
      return null;
    }

    return (
      <View style={{flex: 1}}>
        {this.renderPurchasePackages()}
        <View style={globalStyles.bevLine}>
          <View style={globalStyles.bevLineLeft}>
            <Text style={globalStyles.bevLineTextTitle}>Promo Code:</Text>
          </View>
          <View style={globalStyles.bevLineRight}>
            <TextInput
              style={{
                height: 40,
                textAlign: "center",
                width: 65,
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
                  if (!this.props.attemptingUpdate
                     && this.props.creditCards.length > 1
                     && card.id !== this.getActiveCard().id
                    ) {
                    this.props.updateDefaultCard(card.id);
                  }
                }}
                style={[globalStyles.bevLineLeft, {
                  alignItems: "flex-start",
                  flexDirection: "row",
                  justifyContent: "flex-start",
              }]}>
                <View style={{flex: -1, flexDirection: "row"}}>
                  <View
                    style={{
                    alignItems: "center",
                    flex: -1,
                    justifyContent: "center",
                    marginTop: 4,
                    paddingRight: 15,
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
                  <View style={{flex: -1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <FontAwesome name={"cc-" + card.brand.toLowerCase()} size={30} style={{paddingRight: 10}}/>
                    <Text style={globalStyles.bevLineText}>.... {card.last4}</Text>
                  </View>
                </View>
              </TouchableHighlight>
              <View style={globalStyles.bevLineRight}>
                <TouchableHighlight
                underlayColor={"transparent"}
                  onPress={() => {
                    if (!this.props.attemptingUpdate) {
                      this.props.removeCard(card.id, index);
                    }
                  }}
                  style={{
                    paddingRight: 10,
                  }}>
                  <Text style={{color: "#999"}}>{this.props.attemptingUpdate ? "Updating..." : "Remove"}</Text>
                </TouchableHighlight>
              </View>
            </View>
          );
        }) : <View/>}
        <View style={[globalStyles.bevLine]}>
          <TouchableHighlight
            underlayColor={"transparent"}
            style={{
              flex: 1,
              flexDirection: "row",
            }}
            onPress={() => {
              this.props.goToAddCreditCardRoute();
            }}
          >
            <View style={{flex: 1, flexDirection: "row"}}>
              <View style={[globalStyles.bevLineLeft, {flex: 2}]}>
                <Text
                  style={[globalStyles.bevLineTextTitle, {
                    fontWeight: "normal",
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
    );
  }

  private renderSendAndPurchaseOptions() {
    const listFlex = 1;
    const bottomButtonFlex = -1;
    let buttonText: string;
    const purchaseText = "Purchase";
    const sendText = "Send";
    if (this.userIsPurchasingAndSending()) {
      buttonText = `${purchaseText} & ${sendText}`;
    } else if (this.userIsPurchasing()) {
      buttonText = purchaseText;
    } else if (this.userIsSending()) {
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
              {this.renderMessageLine()}
              {/* Add empty view to ensure elements above are viewable */}
              <View style={{height: viewBelowHeight + 20, width: WindowWidth}}></View>
            </View>
          </RouteWithNavBarWrapper>
        </View>
        <View style={{
          backgroundColor: "#ffffff",
          elevation: 15,
          flex: bottomButtonFlex,
          shadowColor: "#333333",
          shadowOpacity: 0.15,
          shadowRadius: 2,
          zIndex: 1,
        }}>
          <View style={[globalStyles.bevContainer, {flex: -1, margin: 0, paddingVertical: 10, paddingHorizontal: 10}]}>
            <View style={[
              globalStyles.bevLineNoSep,
              {
                alignItems: "center",
                height: getButtonHeight(this.buttonFontSize),
                justifyContent: "center",
                paddingBottom: 0,
              }]}>
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
}

interface Style {
  numBeersContainer: React.ViewStyle;
  numBeersButtonContainer: React.ViewStyle;
  numBeersButton: React.ViewStyle;
  numBeersButtonText: React.TextStyle;
}

const styles = StyleSheet.create<Style>({
  numBeersButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: globalColors.bevPrimary,
    borderRadius: 100,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  numBeersButtonContainer: {
    flex: -1,
    flexDirection: "row",
  },
  numBeersButtonText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  numBeersContainer: {
    flex: 1,
    flexDirection: "row",
  },
});
