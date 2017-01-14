import * as React from "react";
import { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
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
import CPurchaseAndOrSendInProgress from '../containers/CPurchaseAndOrSendInProgress';

const scenes = (showLogin) => {
  return (
    Actions.create(
      <Scene key="root" hideNavBar={true}>
        <Scene
          key="Login"
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
          navBar={() => (
              <CBranding
                showLogo={true}
                showSettings={true}
              />
          )}
        />
        <Scene
          key="PurchaseBevegram"
          component={CPurchaseBevegram}
          navBar={() => (
            <CBranding
              showBack={true}
              navBarText="Purchase Bevegrams"
            />
          )}
        />
        <Scene
          key="SendBevegram"
          component={CPurchaseBevegram}
          navBar={() => (
            <CBranding
              showBack={true}
              navBarText="Send Bevegrams"
            />
          )}
        />
        <Scene
          key="PurchaseInProgress"
          component={CPurchaseAndOrSendInProgress}
          // Don't let the user out of this view until it is complete
          panHandlers={null}
          navBar={() => (
            <CBranding
              navBarText="Purchasing..."
            />
          )}
        />
        <Scene
          key="SendInProgress"
          component={CPurchaseAndOrSendInProgress}
          // Don't let the user out of this view until it is complete
          panHandlers={null}
          navBar={() => (
            <CBranding
              navBarText="Sending..."
            />
          )}
        />
        <Scene
          key="Settings"
          component={CSettings}
          navBar={() => (
            <CBranding
              showBack={true}
              navBarText="Settings"
            />
          )}
        />
        <Scene
          key="RedeemBeer"
          component={CRedeemBeer}
          navBar={() => (
            <CBranding
              showBack={true}
              navBarText="Redeem Bevegrams"
            />
          )}
        />
        <Scene
          key="AddCreditCard"
          component={CAddCreditCard}
          navBar={() => (
            <CBranding
              showBack={true}
              navBarText="Add Credit Card"
            />
          )}
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
