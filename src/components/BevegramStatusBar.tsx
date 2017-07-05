import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

import BevButton from "./BevButton";
import { globalColors, globalStyles } from "./GlobalStyles";

export interface BevegramStatusBarProps {
  userBevegrams?: number;
  goToPurchase?(): void;
}

const BevegramStatusBar: React.StatelessComponent<BevegramStatusBarProps> = ({
  userBevegrams,
  goToPurchase,
}) => {
  return (
    <View
      style={{
        borderBottomColor: globalColors.lightSeparator,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flex: 1,
        flexDirection: "row",
      }}
    >
      <View
        style={{
          alignItems: "center",
          flex: -1,
          flexDirection: "row",
          justifyContent: "center",
          paddingLeft: 10,
        }}
      >
        <Text style={globalStyles.bevLineTextTitle}>
          Your Bevegrams :
        </Text>
        <Text style={globalStyles.bevLineText}>
          {" " + userBevegrams.toString()}
        </Text>
      </View>
      <View
        style={{
          alignItems: "flex-end",
          flex: 1,
        }}
      >
        <BevButton
          text="Buy More"
          shortText="Buy More"
          label="Buy More Bevegrams"
          rightIcon={true}
          isGreen={true}
          onPress={() => goToPurchase()}
        />
      </View>
    </View>
  );
};

export default BevegramStatusBar;
