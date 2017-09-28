import * as React from "react";

import { TextInput, View } from "react-native";

import theme from "../theme";

import { Location, VENDOR_ID_LENGTH } from "../db/tables";

import { BevLargerTextInputStyle } from "./BevLargerText";
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
    : props.failed ? theme.colors.failureBg : undefined;
  const uiIcon = props.successful
    ? "thumbsUp"
    : props.failed ? "thumbsDown" : "lock";

  const locName = props.loc ? props.loc.name : "";
  const textInputWidth = 100;

  return (
    <RouteWithNavBarWrapper>
      <View style={{ flex: 1, padding: 15 }}>
        <LocationHero loc={props.loc} />
        <BevUiText
          icon="notice"
          fontSize="normal"
          preserveCase={true}
          style={{
            paddingRight: theme.padding.large,
            paddingVertical: theme.padding.normal,
          }}
        >
          {`Your server/bartender must enter the vendor id for ${locName}`}
        </BevUiText>
        <View
          style={[globalStyles.bevLine, { borderBottomColor: underlineColor }]}
        >
          <View style={globalStyles.bevLineLeft}>
            <BevUiText
              icon={uiIcon}
              fontSize="large"
              color={uiTextColor}
              iconColor={uiTextColor}
            >
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
              style={[
                BevLargerTextInputStyle(textInputWidth),
                {
                  color: props.successful
                    ? theme.colors.successBg
                    : theme.colors.text,
                },
              ]}
              value={props.inputVendorId}
            />
          </View>
        </View>
      </View>
    </RouteWithNavBarWrapper>
  );
};

export default RedeemVendorIdInput;
