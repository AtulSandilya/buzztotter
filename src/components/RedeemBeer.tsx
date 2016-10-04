import * as React from "react";
import { Component, PropTypes } from 'react';
import { Picker, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

import snakeCase from 'snake-case';

import TitleText from './TitleText';
import BevButton from './BevButton';

import {globalColors} from './GlobalStyles';

const styles = StyleSheet.create({
  purchaseContainer: {
    flex: 1,
    padding: 20,
  },
  purchaseLine: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: globalColors.subtleSeparator,
    paddingBottom: 5,
    marginBottom: 10,
  },
  purchaseLineTextTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  purchaseLineText: {
    fontSize: 20,
  },
  purchaseLineLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  purchaseLineRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
    justifyContent: 'center',
  },
  purchaseLineSliderContainer: {
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

export default class RedeemBeer extends Component {
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

  static propTypes = {
    name: React.PropTypes.string,
    cancelPurchaseAction: React.PropTypes.func,
    id: React.PropTypes.string.isRequired,
    redeemConfirmed: React.PropTypes.bool,
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
              bevButtonPressed={this.props.cancelPurchaseAction}
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
      <View style={styles.purchaseContainer}>
        <View>
          <TitleText title={"Redeem Beer"}></TitleText>
        </View>
        <View style={styles.purchaseLine}>
          <View style={styles.purchaseLineLeft}>
            <Text style={styles.purchaseLineTextTitle}>From:</Text>
          </View>
          <View style={styles.purchaseLineRight}>
            <Text style={styles.purchaseLineText}>{this.props.name}</Text>
          </View>
        </View>
        <View style={styles.purchaseLine}>
          <View style={styles.purchaseLineLeft}>
            <Text style={styles.purchaseLineTextTitle}>Your City:</Text>
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
        <View style={styles.purchaseLine}>
          <View style={styles.purchaseLineLeft}>
            <Text style={styles.purchaseLineTextTitle}>Your Bar:</Text>
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
        <View style={styles.purchaseLine}>
          <View style={styles.purchaseLineLeft}>
            <Text style={styles.purchaseLineTextTitle}>Vendor Id:</Text>
          </View>
          <View style={[styles.purchaseLineRight, {flex: 1, maxWidth: 125}]}>
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
              bevButtonPressed={this.props.cancelPurchaseAction}
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
    );
  }
}
