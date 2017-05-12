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

import {Location} from "../db/tables";

import BevButton from "./BevButton";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";
import TitleText from "./TitleText";

import {globalColors, globalStyles} from "./GlobalStyles";

import {GpsCoordinates, RedeemTransactionStatus} from "../db/tables";

import {PrettyFormatAddress} from "../CommonUtilities";

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
  locations?: [Location];
  onRedeemClicked?(quantity: number, receivedId: string): void;
  closeRedeem?(): void;
  updateLocation?(): void;
}

interface RedeemBeerState {
  numDrinks?: number;
}

export default class RedeemBeer extends Component<RedeemBeerProps, RedeemBeerState> {
  constructor(props) {
    super(props);
    this.state = {
      numDrinks: 1,
    };
  }

  componentDidMount() {
    this.updateLocation();
  }

  purchaseDrink() {
    if (this.props.getLocationFailed || this.props.currentLocationBusinessName === undefined) {
      alert("You are not at an establishment that accepts bevegrams. Please see the map for establishments that accept bevegrams.");
      return;
    }

    this.props.onRedeemClicked(this.state.numDrinks, this.props.id);
  }

  renderErrorMessage() {
    if(this.props.redeemTransactionStatus.error) {
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
      )
    }
  }

  isRedeemComplete() {
    const status: RedeemTransactionStatus = this.props.redeemTransactionStatus;
    return transactionFinished<RedeemTransactionStatus>(status);
  }

  renderPurchaseConfirmed() {
    if (this.isRedeemComplete()) {
      return (
        <View>
          {!transactionFailed(this.props.redeemTransactionStatus) ?
            <View style={{flex: 1, alignItems: "center", paddingTop: 20}}>
              <Text style={{color: globalColors.bevPrimary, fontSize: 30}}>1 Beer Redeemed!</Text>
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

  updateLocation() {
    this.props.updateLocation();
  }

  render() {
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
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>Quantity:</Text>
            </View>
            <View style={globalStyles.bevLineRight}>
              <Text style={globalStyles.bevLineText}>{this.props.quantity}</Text>
            </View>
          </View>
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
                    <ActivityIndicator
                      size="large"
                    />
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
                  text={`Redeem ${this.props.quantity} Bevegram${this.props.quantity === 1 ? "" : "s"}`}
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
