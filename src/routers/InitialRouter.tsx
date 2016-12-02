import * as React from "react";
import { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { connect } from 'react-redux';

import { Actions, Router, Scene } from 'react-native-router-flux';

import store from '../configureStore';

import {globalColors} from '../components/GlobalStyles';
import {isAndroid, isIOS, isNarrow} from '../Utilities';

import Icon from 'react-native-vector-icons/Ionicons';

import MainUi from '../components/MainUi';
import CLogin from '../containers/CLogin';
import CPurchaseBevegram from '../containers/CPurchaseBevegram';
import CSettings from '../containers/CSettings';
import CRedeemBeer from '../containers/CRedeemBeer';
import CAddCreditCard from '../containers/CAddCreditCard';
import CBranding from '../containers/CBranding';

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

export const NavBarHeight = isIOS ? 64 : 54;

const backIcon = (text) => {
  let hitSlop = 10;
  return (
    <TouchableOpacity
      onPress={() => {
        store.dispatch({type: 'GO_BACK_ROUTE'});
      }}
      style={{
        width: 115,
        flex: -1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
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
          fontSize: 28,
          paddingRight: 10,
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

const disablePanHandlerOnAndroid = isAndroid ? {panHandlers: null} : {};

const scenes = (showLogin) => {
  return (
    Actions.create(
      <Scene key="root" hideNavBar={true}>
        <Scene
          key="loginScene"
          hideNavBar={true}
          component={CLogin}
          panHandlers={null}
          initial={showLogin}
        />
        <Scene
          key="MainUi"
          component={MainUi}
          panHandlers={null}
          initial={!showLogin}
          hideNavBar={false}
          navBar={CBranding}
        />
        <Scene
          key="PurchaseBevegram"
          title="Purchase Bevegrams"
          component={CPurchaseBevegram}
          {...disablePanHandlerOnAndroid}
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
          key="Settings"
          title="Settings"
          component={CSettings}
          {...disablePanHandlerOnAndroid}
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
          {...disablePanHandlerOnAndroid}
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
          {...disablePanHandlerOnAndroid}
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
  goBackRoute?(): void;
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
        backAndroidHandler={() => {
          this.props.goBackRoute();
          // Not sure why but this makes the back button stop, otherwise the
          // back action will continue and eventually exit the app.
          return true;
        }}
      />
    );
  }
}
