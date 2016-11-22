import * as React from "react";
import { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';

import { Actions, Router, Scene } from 'react-native-router-flux';

import store from '../configureStore';

import {globalColors} from '../components/GlobalStyles';
import {isAndroid, isNarrow} from '../Utilities';

import Icon from 'react-native-vector-icons/Ionicons';

import MainUi from '../components/MainUi';
import CLogin from '../containers/CLogin';
import CPurchaseBeer from '../containers/CPurchaseBeer';
import CSettings from '../containers/CSettings';
import CRedeemBeer from '../containers/CRedeemBeer';
import CAddCreditCard from '../containers/CAddCreditCard';

interface Style {
  navBarStyle: React.ViewStyle;
  titleStyle: React.TextStyle;
}

const styles = StyleSheet.create<Style>({
  navBarStyle: {
    backgroundColor: globalColors.bevPrimary,
  },
  titleStyle: {
    color: '#ffffff',
  },
})

const backIcon = (text) => {
  let hitSlop = 10;
  return (
    <TouchableOpacity
      onPress={() => {
        Actions.pop();
      }}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: 115,
        marginTop: 5,
      }}
      hitSlop={{
        top: hitSlop,
        right: hitSlop,
        bottom: hitSlop,
        left: hitSlop,
      }}
    >
      <Icon
        name="ios-arrow-back"
        style={{
          color: "#ffffff",
          fontSize: 32,
          paddingRight: 10
        }}
      />
      <Text style={{
        fontSize: 16,
        color: "#ffffff",
        paddingRight: 15,
        overflow: "visible",
      }}
      >
        {isNarrow ? "" : text}
      </Text>
    </TouchableOpacity>
  )
}

const scenes = (showLogin) => {
  return (
    Actions.create(
      <Scene key="root" hideNavBar={true}>
        <Scene key="loginScene" hideNavBar={true} component={CLogin} initial={showLogin}/>
        <Scene key="MainUi" hideNavBar={true} component={MainUi} panHandlers={null} initial={!showLogin}/>
        <Scene
          key="PurchaseBeer"
          title="Purchase Beer"
          component={CPurchaseBeer}
          backTitle="Contacts"
          hideNavBar={false}
          navigationBarStyle={styles.navBarStyle}
          titleStyle={styles.titleStyle}
          backButtonTextStyle={styles.titleStyle}
          renderBackButton={(input) => {
            return backIcon(input.backTitle);
          }}
        />
        <Scene
          key="Settings"
          title="Settings"
          component={CSettings}
          backTitle=""
          hideNavBar={false}
          navigationBarStyle={styles.navBarStyle}
          titleStyle={styles.titleStyle}
          backButtonTextStyle={styles.titleStyle}
          renderBackButton={(input) => {
            return backIcon(input.backTitle);
          }}
        />
        <Scene
          key="RedeemBeer"
          title="Redeem Beer"
          component={CRedeemBeer}
          backTitle="Bevegrams"
          hideNavBar={false}
          navigationBarStyle={styles.navBarStyle}
          titleStyle={styles.titleStyle}
          backButtonTextStyle={styles.titleStyle}
          renderBackButton={(input) => {
            return backIcon(input.backTitle);
          }}
        />
        <Scene
          key="AddCreditCard"
          title="Add Credit Card"
          component={CAddCreditCard}
          backTitle="Purchase"
          hideNavBar={false}
          navigationBarStyle={styles.navBarStyle}
          titleStyle={styles.titleStyle}
          backButtonTextStyle={styles.titleStyle}
          renderBackButton={(input) => {
            return backIcon(input.backTitle);
          }}
        />
      </Scene>
    )
  )
}

const CRouter = connect()(Router);

export interface InitialRouterProps {
  showLogin?: boolean;
  isLoading?: boolean;
}

export default class InitialRouter extends Component<InitialRouterProps, {}> {
  render() {
    if(this.props.isLoading) {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text>Loading!</Text>
        </View>
      )
    }
    return(
      <CRouter
        scenes={scenes(this.props.showLogin)}
        backAndroidHandler={() => {return true;}}
      />
    );
  }
}
