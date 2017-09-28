import * as React from "react";
import { Text, View } from "react-native";

import theme from "../theme";

import { Location, RedeemTransactionStatus } from "../db/tables";
import { transactionFailed } from "../sagas/firebase";

import { globalStyles } from "./GlobalStyles";

import BevButton from "./BevButton";
import LocationHero from "./LocationHero";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";
import StatusLine from "./StatusLine";

export interface RedeemInProgressProps {
  attempting: boolean;
  failMessage: string;
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
            padding: theme.padding.normal,
          }}
        >
          <View style={{ marginBottom: theme.padding.normal }}>
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
            ? <View>
                <View style={globalStyles.bevLineNoSep}>
                  <Text
                    style={[globalStyles.bevLineTextTitle, { color: "red" }]}
                  >
                    Redeem Error:
                  </Text>
                </View>
                <View style={globalStyles.bevLine}>
                  <Text
                    style={globalStyles.bevLineText}
                    numberOfLines={Infinity}
                  >
                    {this.props.status.error}
                  </Text>
                </View>
                <BevButton
                  text="Done"
                  shortText="Done"
                  iconType="success"
                  onPress={this.props.onClose}
                />
              </View>
            : null}
        </View>
      </RouteWithNavBarWrapper>
    );
  }
}

export default RedeemInProgress;
