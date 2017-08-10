import * as React from "react";
import { View } from "react-native";

import theme from "../theme";

import { Location, RedeemTransactionStatus } from "../db/tables";
import { transactionFailed } from "../sagas/firebase";

import BevUiButton from "./BevUiButton";
import LocationHero from "./LocationHero";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";
import StatusLine from "./StatusLine";

export interface RedeemInProgressProps {
  attempting: boolean;
  loc: Location;
  status: RedeemTransactionStatus;
  onClose: () => void;
}

class RedeemInProgress extends React.Component<RedeemInProgressProps, {}> {
  public render() {
    return (
      <RouteWithNavBarWrapper>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            padding: theme.padding.default,
          }}
        >
          <View style={{ marginBottom: theme.padding.default }}>
            <LocationHero loc={this.props.loc} />
          </View>
          <StatusLine
            title="Vendor Verification"
            statusKey="vendorVerified"
            statusObject={this.props.status}
          />
          <StatusLine
            title="Location Verification"
            statusKey="locationVerified"
            statusObject={this.props.status}
          />
          <StatusLine
            title="Account Update"
            statusKey="updatingDatabase"
            statusObject={this.props.status}
          />
          {transactionFailed<RedeemTransactionStatus>(this.props.status)
            ? <BevUiButton
                text="Back"
                icon="chevron-left"
                left={true}
                onPress={this.props.onClose}
              />
            : null}
        </View>
      </RouteWithNavBarWrapper>
    );
  }
}

export default RedeemInProgress;
