import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";

import * as RNRF from "react-native-router-flux";

import Loading from "./components/Loading";
import MainUi from "./components/MainUi";
import CAddCreditCard from "./containers/CAddCreditCard";
import CBranding from "./containers/CBranding";
import CLocationDetail from "./containers/CLocationDetail";
import CLogin from "./containers/CLogin";
import CMessage from "./containers/CMessage";
import CPurchaseAndOrSendInProgress from "./containers/CPurchaseAndOrSendInProgress";
import CPurchaseBevegram from "./containers/CPurchaseBevegram";
import CRedeemBeer from "./containers/CRedeemBeer";
import CRedeemComplete from "./containers/CRedeemComplete";
import CRedeemInProgress from "./containers/CRedeemInProgress";
import CRedeemVendorIdInput from "./containers/CRedeemVendorIdInput";
import CSettings from "./containers/CSettings";

import { routeKeys as RouteNames } from "./reducers/routes";

const scenes = (showLogin: boolean | undefined) => {
  return RNRF.Actions.create(
    <RNRF.Scene key="root" hideNavBar={true}>
      <RNRF.Scene
        key={RouteNames.Login}
        hideNavBar={true}
        component={CLogin}
        panHandlers={null}
        initial={showLogin}
      />
      <RNRF.Scene
        key={RouteNames.MainUi}
        component={MainUi}
        panHandlers={null}
        initial={!showLogin}
        hideNavBar={false}
        navBar={() => <CBranding showLogo={true} showSettings={true} />}
      />
      <RNRF.Scene
        key={RouteNames.PurchaseBevegram}
        component={CPurchaseBevegram}
        navBar={() =>
          <CBranding showBack={true} navBarText="Purchase Bevegrams" />}
      />
      <RNRF.Scene
        key={RouteNames.SendBevegram}
        component={CPurchaseBevegram}
        navBar={() =>
          <CBranding showBack={true} navBarText="Send Bevegram(s)" />}
      />
      <RNRF.Scene
        key={RouteNames.PurchaseInProgress}
        component={CPurchaseAndOrSendInProgress}
        // Don"t let the user out of this view until it is complete
        panHandlers={null}
        navBar={() => <CBranding navBarText="Purchasing..." />}
      />
      <RNRF.Scene
        key={RouteNames.SendInProgress}
        component={CPurchaseAndOrSendInProgress}
        // Don"t let the user out of this view until it is complete
        panHandlers={null}
        navBar={() => <CBranding navBarText="Sending..." />}
      />
      <RNRF.Scene
        key={RouteNames.Settings}
        component={CSettings}
        navBar={() => <CBranding showBack={true} navBarText="Settings" />}
      />
      <RNRF.Scene
        key={RouteNames.RedeemBeer}
        component={CRedeemBeer}
        navBar={() =>
          <CBranding showBack={true} navBarText="Redeem Bevegrams" />}
      />
      <RNRF.Scene
        key={RouteNames.RedeemVendorIdInput}
        component={CRedeemVendorIdInput}
        navBar={() => <CBranding showBack={true} navBarText="Vendor Id" />}
      />
      <RNRF.Scene
        key={RouteNames.RedeemInProgress}
        component={CRedeemInProgress}
        panHandlers={null}
        navBar={() => <CBranding showBack={false} navBarText="Redeeming..." />}
      />
      <RNRF.Scene
        key={RouteNames.RedeemComplete}
        component={CRedeemComplete}
        panHandlers={null}
        navBar={() =>
          <CBranding showBack={false} navBarText="Redeem Successful!" />}
      />
      <RNRF.Scene
        key={RouteNames.AddCreditCard}
        component={CAddCreditCard}
        navBar={() =>
          <CBranding showBack={true} navBarText="Add Credit Card" />}
      />
      <RNRF.Scene
        key={RouteNames.LocationDetail}
        component={CLocationDetail}
        navBar={() =>
          <CBranding showBack={true} navBarText="Location Detail" />}
      />
      <RNRF.Scene
        key={RouteNames.Message}
        component={CMessage}
        navBar={() => <CBranding showBack={true} navBarText="Message" />}
      />
    </RNRF.Scene>,
  );
};

const CRouter = connect()(RNRF.Router as any) as any;

export interface RouterProps {
  showLogin?: boolean;
  isLoading?: boolean;
  goBackRoute(): void;
}

export default class Router extends Component<RouterProps, {}> {
  public render() {
    if (this.props.isLoading) {
      return <Loading />;
    }

    return (
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
