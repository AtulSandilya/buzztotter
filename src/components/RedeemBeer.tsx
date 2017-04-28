import * as React from "react";
import { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import {Location} from '../db/tables';
import {LocationsMatch} from '../CommonUtilities';

import RouteWithNavBarWrapper from './RouteWithNavBarWrapper';
import TitleText from './TitleText';
import BevButton from './BevButton';

import {globalColors, globalStyles} from './GlobalStyles';

import {DeviceLocation} from '../reducers/redeemView';

export interface RedeemBeerProps {
  id?: string;
  name?: string;
  quantity?: number;
  currentLocation?: DeviceLocation;
  currentLocationBusinessName?: string;
  currentLocationLastModified?: string;
  getLocationFailed?: boolean;
  redeemConfirmed?: boolean;
  locations?: [Location];
  onRedeemClicked?(string): void;
  closeRedeem?(): void;
  updateLocation?(string): void;
}

interface RedeemBeerState {
  numDrinks?: number;
}

export default class RedeemBeer extends Component<RedeemBeerProps, RedeemBeerState> {
  constructor(props){
    super(props);
    this.state = {
      numDrinks: 1,
    };
  }

  componentDidMount() {
    this.updateLocation();
  }

  purchaseDrink() {
    if(this.props.getLocationFailed || this.props.currentLocationBusinessName === undefined){
      alert("You are not at an establishment that accepts bevegrams. Please see the map for establishments that accept bevegrams.");
      return;
    }

    // TODO: implement this end to end
    // this.props.onRedeemClicked(this.props.id);
    alert("Not implemented");
  }

  renderPurchaseConfirmed(){
    if(this.props.redeemConfirmed){
      return (
        <View>
          <View style={{flex: 1, alignItems: 'center', paddingTop: 20}}>
            <Text style={{color: globalColors.bevPrimary, fontSize: 30}}>1 Beer Redeemed!</Text>
          </View>
          <View style={{alignItems: 'flex-end', paddingTop: 10}}>
            <BevButton
              onPress={this.props.closeRedeem}
              text={"Close"}
              shortText={"Close"}
              label="Close Redeem Button"
              buttonFontSize={20}
            />
          </View>
        </View>
      )
    }
  }

  updateLocation() {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        const deviceLocation: DeviceLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        const matchingLocations = this.props.locations.filter((business) => {
          const businessLocation = {
            latitude: business.latitude,
            longitude: business.longitude,
          }

          return LocationsMatch(deviceLocation, businessLocation, business.name);
        })

        let businessName: string;

        if(matchingLocations.length === 1){
          businessName = matchingLocations[0].name + "\n" + matchingLocations[0].address.split(",")[0] + "\n" + matchingLocations[0].address.split(", ").slice(1).join(", ")
        } else {
          businessName = undefined;
        }

        this.props.updateLocation(Object.assign({}, {
          currentLocation: deviceLocation,
          getLocationFailed: businessName === undefined,
          currentLocationBusinessName: businessName,
        }))
      }, undefined, {enableHighAccuracy: false, timeout: 20000, maximumAge: 1});
    } catch(e) {
      this.props.updateLocation(Object.assign({}, {
        location: undefined,
        getLocationFailed: true,
        currentLocationBusinessName: "",
      }))
    }
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
            <View style={globalStyles.bevLineRight}>
              <TouchableHighlight
                onPress={() => this.updateLocation()}
                underlayColor={'rgba(255, 255, 255, 0.1)'}
              >
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
                      "Unable to determine your location"
                    :
                      "Retrieving Location..."
                    }
                    </Text>
                  }
                  <Text style={[globalStyles.bevTipText, {paddingTop: 5}]}>TAP TO REFRESH</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <View style={{paddingBottom: 10}}>
            <View>
              <Text style={{color: 'red'}}>* Show this to your bartender or server:</Text>
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
                style={{flex: 1, textAlign: 'right', paddingRight: 10}}
                keyboardType={'numeric'}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 20}}>
            <View style={{flex: -1, alignItems: 'flex-start'}}>
              <BevButton
                onPress={this.props.closeRedeem}
                text={"Close"}
                shortText={""}
                fontAwesomeLeftIcon="ban"
                label="Close Redeem Button"
                buttonFontSize={18}
              />
            </View>
            <View style={{flex: -1, alignItems: 'flex-end'}}>
              <BevButton
                onPress={this.purchaseDrink.bind(this)}
                text={`Redeem ${this.props.quantity} Bevegram${this.props.quantity === 1 ? "" : "s"}`}
                shortText={"Redeem"}
                label={"Redeem Bevegram Button"}
                buttonFontSize={18}
              />
            </View>
          </View>
          {this.renderPurchaseConfirmed()}
        </View>
      </RouteWithNavBarWrapper>
    );
  }
}
