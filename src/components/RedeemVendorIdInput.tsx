import * as React from "react";

import { Text, TextInput, View } from "react-native";

import theme from "../theme";

import { Location, VENDOR_ID_LENGTH } from "../db/tables";

import BevUiText from "./BevUiText";
import LocationHero from "./LocationHero";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";

import { globalStyles } from "./GlobalStyles";

export interface RedeemVendorIdInputProps {
  inputVendorId: string;
  loc: Location;
  successful: boolean;
  failed: boolean;
  verifyVendorId: (input: string) => void;
}

const RedeemVendorIdInput: React.StatelessComponent<
  RedeemVendorIdInputProps
> = props => {
  const underlineColor = props.successful
    ? theme.colors.successBg
    : props.failed ? theme.colors.failureBg : theme.colors.uiLight;
  const uiTextColor = props.successful
    ? theme.colors.successBg
    : props.failed ? theme.colors.failureBg : theme.colors.text;
  const uiIcon = props.successful
    ? "thumbs-up"
    : props.failed ? "thumbs-down" : "lock";

  const locName = props.loc ? props.loc.name : "";

  return (
    <RouteWithNavBarWrapper>
      <View style={{ flex: 1, padding: 15 }}>
        <LocationHero loc={props.loc} />
        <Text style={{ paddingTop: 30 }}>
          {`Your server/bartender must enter the vendor id for ${locName}`}
        </Text>
        <View
          style={[globalStyles.bevLine, { borderBottomColor: underlineColor }]}
        >
          <View style={globalStyles.bevLineLeft}>
            <BevUiText icon={uiIcon} fontSize="large" color={uiTextColor}>
              Vendor Id:
            </BevUiText>
          </View>
          <View style={globalStyles.bevLineRight}>
            <TextInput
              autoFocus={true}
              keyboardType="numeric"
              maxLength={VENDOR_ID_LENGTH}
              onChangeText={text => props.verifyVendorId(text)}
              returnKeyType="done"
              secureTextEntry={true}
              style={{
                color: props.successful
                  ? theme.colors.successBg
                  : theme.colors.text,
                fontSize: 24,
                fontWeight: "300",
                height: 44,
                width: 100,
              }}
              value={props.inputVendorId}
            />
          </View>
        </View>
      </View>
    </RouteWithNavBarWrapper>
  );
};

export default RedeemVendorIdInput;
