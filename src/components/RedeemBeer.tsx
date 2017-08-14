import * as React from "react";
import { Component } from "react";
import { Alert, Text, TouchableHighlight, View } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import theme from "../theme";

import {
  DEFAULT_REDEEM_PICKER_LOCATIONS,
  Location,
  ReceivedBevegram,
} from "../db/tables";

import BevUiButton from "./BevUiButton";
import BevUiText from "./BevUiText";
import RedeemLocationChoiceLine from "./RedeemLocationChoiceLine";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";

import { BevLayoutAnimation, globalStyles } from "./GlobalStyles";

export interface RedeemBeerProps {
  id?: string;
  name?: string;
  isRefreshingLocation?: boolean;
  receivedBevegram?: ReceivedBevegram;
  pickerLocations?: Location[];
  goToMap?(): void;
  updateLocation?(): void;
  selectLocation?(loc: Location, quantity: number): void;
}

interface RedeemBeerState {
  numDrinks?: number;
}

export const RedeemAlert = (message: string, buttons: any[]) => {
  Alert.alert("Redeem Error", message, buttons, { cancelable: false });
};

/* tslint:disable:member-ordering */
export default class RedeemBeer extends Component<
  RedeemBeerProps,
  RedeemBeerState
> {
  constructor(props) {
    super(props);
    this.state = {
      numDrinks: 1,
      // numDrinks: this.props.receivedBevegram.quantity - this.props.receivedBevegram.quantityRedeemed,
    };
    this.updateQuantity = this.updateQuantity.bind(this);
    this.goToMapAlert = this.goToMapAlert.bind(this);
  }

  public componentDidMount() {
    this.props.updateLocation();
  }

  public componentWillUpdate() {
    BevLayoutAnimation();
  }

  private goToMapAlert() {
    Alert.alert(
      "Notice",
      "You are not at a location that accepts bevegrams. Go to the map to see locations that accept bevegrams.",
      [
        { text: "Go To Map", onPress: () => this.props.goToMap() },
        {
          onPress: () => this.props.updateLocation(),
          text: "Refresh Location",
        },
        { text: "Cancel" },
      ],
    );
  }

  private renderQuantityLine() {
    // const bev = this.props.receivedBevegram;
    // const allowIncrement = bev && (bev.quantity > 1) && (bev.quantity > bev.quantityRedeemed);
    const allowIncrement = false;
    return (
      <View style={globalStyles.bevLine}>
        <View style={[globalStyles.bevLineLeft, { flex: 1 }]}>
          <Text style={globalStyles.bevLineTextTitle}>Quantity:</Text>
        </View>
        <View
          style={[
            globalStyles.bevLineRight,
            { flex: 1, justifyContent: "flex-end" },
          ]}
        >
          <Text style={globalStyles.bevLineText}>{this.state.numDrinks}</Text>
          {allowIncrement
            ? <View style={{ flexDirection: "row" }}>
                <TouchableHighlight
                  onPress={() => this.updateQuantity(-1)}
                  underlayColor="#ffffff"
                >
                  <FontAwesome
                    name="minus-circle"
                    style={{
                      color: "#999",
                      fontSize: 20,
                      marginLeft: 30,
                    }}
                  />
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => this.updateQuantity(1)}
                  underlayColor="#ffffff"
                >
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
            : <View />}
        </View>
      </View>
    );
  }

  private hasValidPickerLocations(): boolean {
    for (const loc of this.props.pickerLocations) {
      if (loc !== undefined) {
        return true;
      }
    }
    return false;
  }

  private updateQuantity(amount: number) {
    const newAmount = this.state.numDrinks + amount;
    const min = 1;
    const max =
      this.props.receivedBevegram.quantity -
      this.props.receivedBevegram.quantityRedeemed;
    if (newAmount >= min && newAmount <= max) {
      this.setState((state, props) => {
        return {
          ...state,
          numDrinks: this.state.numDrinks + amount,
        };
      });
    }
  }

  private renderPickers() {
    return (
      <View>
        <View
          style={[
            globalStyles.bevLine,
            { borderBottomWidth: 0, marginBottom: 0 },
          ]}
        >
          <View style={globalStyles.bevLineLeft}>
            <Text style={globalStyles.bevLineTextTitle}>
              Select Your Location:
            </Text>
          </View>
          <View style={globalStyles.bevLineRight}>
            <TouchableHighlight
              onPress={() => {
                if (!this.props.isRefreshingLocation) {
                  this.props.updateLocation();
                }
              }}
              underlayColor="#ffffff"
            >
              <View>
                <BevUiText icon="refresh">
                  {this.props.isRefreshingLocation ? "Refreshing" : "Refresh"}
                </BevUiText>
              </View>
            </TouchableHighlight>
          </View>
        </View>
        {this.hasValidPickerLocations() || this.props.isRefreshingLocation
          ? <View>
              {this.props.pickerLocations.map((l: Location, i: number) => {
                return (
                  <RedeemLocationChoiceLine
                    loc={l}
                    index={i + 1}
                    isLoading={this.props.isRefreshingLocation}
                    onPress={() => {
                      if (!this.props.isRefreshingLocation || l) {
                        this.props.selectLocation(l, this.state.numDrinks);
                      }
                    }}
                    key={i}
                  />
                );
              })}
              <RedeemLocationChoiceLine
                loc={undefined}
                index={DEFAULT_REDEEM_PICKER_LOCATIONS + 1}
                other={true}
                onPress={this.goToMapAlert}
                isLoading={this.props.isRefreshingLocation}
              />
            </View>
          : <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text
                style={[
                  globalStyles.smallerHeroText,
                  { paddingVertical: theme.padding.default },
                ]}
              >
                Unable to determine your location!
              </Text>
              <BevUiButton
                icon="refresh"
                text="Try Again"
                onPress={this.props.updateLocation}
              />
            </View>}
      </View>
    );
  }

  public render() {
    return (
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
          {this.renderPickers()}
        </View>
      </RouteWithNavBarWrapper>
    );
  }
}
