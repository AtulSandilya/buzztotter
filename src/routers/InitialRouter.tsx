import * as React from "react";
import { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { connect } from "react-redux";

import { Actions, Router, Scene } from "react-native-router-flux";

import store from "../configureStore";

import {globalColors} from "../components/GlobalStyles";
import {isAndroid, isIOS, isNarrow} from "../ReactNativeUtilities";

import Icon from "react-native-vector-icons/Ionicons";

import Loading from "../components/Loading";
import MainUi from "../components/MainUi";
import CAddCreditCard from "../containers/CAddCreditCard";
import CBranding from "../containers/CBranding";
import CLocationDetail from "../containers/CLocationDetail";
import CLogin from "../containers/CLogin";
import CPurchaseAndOrSendInProgress from "../containers/CPurchaseAndOrSendInProgress";
import CPurchaseBevegram from "../containers/CPurchaseBevegram";
import CRedeemBeer from "../containers/CRedeemBeer";
import CSettings from "../containers/CSettings";

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
          // Don"t let the user out of this view until it is complete
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
          // Don"t let the user out of this view until it is complete
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
        <Scene
          key="LocationDetail"
          component={CLocationDetail}
          navBar={() => (
            <CBranding
              showBack={true}
              navBarText="Location Detail"
            />
          )}
        />
      </Scene>,
    )
  );
};

const CRouter = connect()(Router);

export interface InitialRouterProps {
  showLogin?: boolean;
  isLoading?: boolean;
  goBackRoute?(): void;
}

export default class InitialRouter extends Component<InitialRouterProps, {}> {
  public render() {
    if (this.props.isLoading) {
      return (
        <Loading/>
      );
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
