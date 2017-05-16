import * as React from "react";
import { Component } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import {Location} from "../db/tables";

import BevButton from "./BevButton";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";
import TitleText from "./TitleText";

import {globalColors, globalStyles} from "./GlobalStyles";

import {GpsCoordinates, ReceivedBevegram, RedeemTransactionStatus} from "../db/tables";

import {Pluralize} from "../CommonUtilities";

import {transactionFailed, transactionFinished} from "../sagas/firebase";

import theme from "../theme";

export interface RedeemBeerProps {
  id?: string;
  name?: string;
  quantity?: number;
  currentLocation?: GpsCoordinates;
  currentLocationBusinessName?: string;
  currentLocationLastModified?: string;
  getLocationFailed?: boolean;
  getLocationFailedErrorMessage?: string;
  isProcessing?: boolean;
  redeemFailed?: boolean;
  isLoading?: boolean;
  isRefreshingLocation?: boolean;
  redeemTransactionStatus?: RedeemTransactionStatus;
  receivedBevegram?: ReceivedBevegram;
  locations?: [Location];
  onRedeemClicked?(quantity: number, receivedId: string): void;
  closeRedeem?(): void;
  updateLocation?(): void;
}

interface RedeemBeerState {
  numDrinks?: number;
}

/* tslint:disable:member-ordering */
/* tslint:disable:no-magic-numbers */
export default class RedeemBeer extends Component<RedeemBeerProps, RedeemBeerState> {
  constructor(props) {
    super(props);
    this.state = {
      numDrinks: this.props.receivedBevegram.quantity - this.props.receivedBevegram.quantityRedeemed,
    };
  }

  public componentDidMount() {
    this.updateLocation();
  }

  private purchaseDrink() {
    if (this.props.getLocationFailed || this.props.currentLocationBusinessName === undefined) {
      alert("You are not at an establishment that accepts bevegrams." +
        " Please see the map for establishments that accept bevegrams.");
      return;
    }

    this.props.onRedeemClicked(this.state.numDrinks, this.props.id);
  }

  private renderErrorMessage() {
    if (this.props.redeemTransactionStatus.error) {
      return (
        <View style={globalStyles.bevLine}>
          <View style={globalStyles.bevLineLeft}>
            <Text style={globalStyles.bevLineTextTitle}>Error:</Text>
          </View>
          <View style={globalStyles.bevLineRight}>
            <Text style={[globalStyles.bevMultiLineText, {color: theme.colors.failure}]}>
              {this.props.redeemTransactionStatus.error}
              </Text>
          </View>
        </View>
      );
    }
  }

  private renderQuantityLine() {
    const bev = this.props.receivedBevegram;
    const allowIncrement = bev && (bev.quantity > 1) && (bev.quantity > bev.quantityRedeemed);
    return (
      <View style={globalStyles.bevLine}>
        <View style={[globalStyles.bevLineLeft, {flex: 1}]}>
          <Text style={globalStyles.bevLineTextTitle}>Quantity:</Text>
        </View>
        <View style={[globalStyles.bevLineRight, {flex: 1, justifyContent: "flex-end"}]}>
          <Text style={globalStyles.bevLineText}>{this.state.numDrinks}</Text>
          {allowIncrement ?
            <View style={{flexDirection: "row"}}>
              <TouchableHighlight onPress={() => this.updateQuantity(-1)} underlayColor="#ffffff">
                <FontAwesome
                  name="minus-circle"
                  style={{
                    color: "#999",
                    fontSize: 20,
                    marginLeft: 30,
                  }}
                />
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.updateQuantity(1)} underlayColor="#ffffff">
                <FontAwesome
                  name="plus-circle"
                  style={{
                    color: "#999",
                    fontSize: 20,
                    marginLeft: 30,
                  }}
                />
              </TouchableHighlight>
            </View>
          : <View/>}
        </View>
      </View>
    );
  }

  private updateQuantity(amount: number) {
    const newAmount = this.state.numDrinks + amount;
    const min = 1;
    const max = this.props.receivedBevegram.quantity - this.props.receivedBevegram.quantityRedeemed;
    if (newAmount >= min && newAmount <= max) {
      this.setState((state, props) => {
        return Object.assign({}, state, {
          numDrinks: this.state.numDrinks + amount,
        });
      });
    }
  }

  private isRedeemComplete() {
    const status: RedeemTransactionStatus = this.props.redeemTransactionStatus;
    return transactionFinished<RedeemTransactionStatus>(status);
  }

  private renderPurchaseConfirmed() {
    if (this.isRedeemComplete()) {
      const redeemQuantityMessage = `${this.state.numDrinks} Bevegram${Pluralize(this.state.numDrinks)} Redeemed!`;
      return (
        <View>
          {!transactionFailed(this.props.redeemTransactionStatus) ?
            <View style={{flex: 1, alignItems: "center", paddingTop: 20}}>
              <Text style={{color: globalColors.bevPrimary, fontSize: 30}}>
                {redeemQuantityMessage}
            </Text>
            </View>
          : <View/>}
          <View style={{alignItems: "flex-end", paddingTop: 10}}>
            <BevButton
              onPress={this.props.closeRedeem}
              text={"Close"}
              shortText={"Close"}
              label="Close Redeem Button"
              buttonFontSize={20}
            />
          </View>
        </View>
      );
    }
  }

  private updateLocation() {
    this.props.updateLocation();
  }

  public render() {
    return(
      <RouteWithNavBarWrapper>
        <View style={globalStyles.bevContainer}>
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>From:</Text>
            </View>
            <View style={globalStyles.bevLineRight}>
              <Text style={globalStyles.bevLineText}>{this.props.name}</Text>
            </View>
          </View>
          {this.renderQuantityLine()}
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>Your Location:</Text>
            </View>
              <View style={[globalStyles.bevLineRight, {
                paddingLeft: 15,
              }]}>
              <TouchableHighlight
                onPress={() => this.updateLocation()}
                underlayColor={"rgba(255, 255, 255, 0.1)"}
              >
                {this.props.isRefreshingLocation ?
                  <Text style={globalStyles.bevLineText}>Reloading...</Text>
                :
                  <View>
                    {this.props.currentLocationBusinessName ?
                      <Text
                        style={globalStyles.bevLineText}
                        numberOfLines={3}
                      >
                        {this.props.currentLocationBusinessName}
                      </Text>
                    :
                      <Text style={globalStyles.bevLineText} numberOfLines={2}>
                      {this.props.getLocationFailed ?
                        this.props.getLocationFailedErrorMessage
                      :
                        "Unknown Error checking your location"
                      }
                      </Text>
                    }
                    <Text style={[globalStyles.bevTipText, {paddingTop: 5}]}>TAP TO REFRESH</Text>
                  </View>
                }
              </TouchableHighlight>
            </View>
          </View>
          <View style={{paddingBottom: 10}}>
            <View>
              <Text style={{color: "red"}}>* Show this to your bartender or server:</Text>
              <Text>1. They enter the vendor id and press "Redeem Bevegram".</Text>
              <Text>2. They get you a nice cold beverage.</Text>
              <Text>3. You enjoy a nice cold beverage.</Text>
            </View>
          </View>
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>Vendor PIN:</Text>
            </View>
            <View style={[globalStyles.bevLineRight, {flex: 1, maxWidth: 125}]}>
              <TextInput
                placeholder={"1234"}
                placeholderTextColor={"#bbbbbb"}
                style={{flex: 1, textAlign: "right", paddingRight: 10}}
                keyboardType={"numeric"}
              />
            </View>
          </View>
          {!this.isRedeemComplete() ?
            <View style={[globalStyles.bevLine, {paddingTop: 20}]}>
              <View style={globalStyles.bevLineLeft}>
                <BevButton
                  onPress={this.props.closeRedeem}
                  text={""}
                  shortText={""}
                  fontAwesomeLeftIcon="ban"
                  label="Close Redeem Button"
                  buttonFontSize={18}
                  margin={0}
                />
              </View>
              <View style={globalStyles.bevLineRight}>
                <BevButton
                  onPress={this.purchaseDrink.bind(this)}
                  text={`Redeem ${this.state.numDrinks} Bevegram${this.state.numDrinks === 1 ? "" : "s"}`}
                  shortText={"Redeem"}
                  label={"Redeem Bevegram Button"}
                  buttonFontSize={18}
                  showSpinner={this.props.isProcessing}
                  margin={0}
                />
              </View>
            </View>
          : <View/>}
          {this.renderErrorMessage()}
          {this.renderPurchaseConfirmed()}
        </View>
      </RouteWithNavBarWrapper>
    );
  }
}
