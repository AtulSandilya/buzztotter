import * as React from "react";
import { Component, PropTypes } from 'react';
import { Picker, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

import {Location} from '../reducers/locations';

import snakeCase from 'snake-case';

import RouteWithNavBarWrapper from './RouteWithNavBarWrapper';
import TitleText from './TitleText';
import BevButton from './BevButton';

import {globalColors, globalStyles} from './GlobalStyles';

export interface RedeemBeerProps {
  id?: string;
  name?: string;
  redeemConfirmed?: boolean;
  locations?: [Location];
  onRedeemClicked?(string): void;
  closeRedeem?(): void;
}

interface RedeemBeerState {
  numDrinks?: number;
  paymentMethod?: string;
}

export default class RedeemBeer extends Component<RedeemBeerProps, RedeemBeerState> {
  constructor(props){
    super(props);
    this.state = {
      numDrinks: 1,
      paymentMethod: this.toKey(this.props.locations[0].name),
    };
  }

  toKey(input){
    return snakeCase(input);
  }

  setPaymentMethod(input){
    this.setState({
      paymentMethod: input,
    });
  }

  purchaseDrink() {
    this.props.onRedeemClicked(this.props.id);
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
              bevButtonPressed={this.props.closeRedeem}
              buttonText={"Close"}
              buttonFontSize={20}
            />
          </View>
        </View>
      )
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
              <Text style={globalStyles.bevLineTextTitle}>Your City:</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Picker
                selectedValue={this.state.paymentMethod}
                onValueChange={() => {}}
                style={{flex: 1}}
                mode={"dropdown"}
              >
                <Picker.Item label="Denver" value="denver" />
                <Picker.Item label="Golden" value="golder" />
                <Picker.Item label="Boulder" value="boulder" />
              </Picker>
            </View>
          </View>
          <View style={globalStyles.bevLine}>
            <View style={globalStyles.bevLineLeft}>
              <Text style={globalStyles.bevLineTextTitle}>Your Bar:</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Picker
                selectedValue={this.state.paymentMethod}
                onValueChange={(paymentMethod) => this.setPaymentMethod(paymentMethod)}
                style={{flex: 1}}
                mode={"dropdown"}
              >
                {this.props.locations.map((locationData, id) => {
                  return (
                    <Picker.Item
                      key={id}
                      label={locationData.name}
                      value={this.toKey(locationData.name)}
                    />
                  )
                })}
              </Picker>
            </View>
          </View>
          <View style={{paddingBottom: 10}}>
            <View>
              <Text style={{color: 'red'}}>* Show this to your bartender or server:</Text>
              <Text>1. They enter the vendor id and press "Redeem Beer".</Text>
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
            <View style={{flex: 1, alignItems: 'flex-start'}}>
              <BevButton
                bevButtonPressed={this.props.closeRedeem}
                buttonText={"Cancel"}
                buttonFontSize={20}
              />
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <BevButton
                bevButtonPressed={this.purchaseDrink.bind(this)}
                buttonText={"Redeem Beer"}
                buttonFontSize={20}
              />
            </View>
          </View>
          {this.renderPurchaseConfirmed()}
        </View>
      </RouteWithNavBarWrapper>
    );
  }
}
