import * as React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import theme, { SizeName } from "../theme";

interface BevShadowProps {
  children: React.ReactChild;
  margin?: SizeName;
  borderRadius?: number;
  // This seems weird here, but there are cases (Buttons) where it helps to
  // omit the shadow
  hasShadow?: boolean;
}

interface Styles {
  shadow: ViewStyle;
}

const margin = theme.margin.extraSmall;

const style = StyleSheet.create<Styles>({
  shadow: {
    elevation: 3,
    margin,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
});

const BevShadow: React.StatelessComponent<BevShadowProps> = props => {
  return (
    <View
      style={[
        props.hasShadow === false ? {} : style.shadow,
        props.margin
          ? {
              margin: props.margin,
            }
          : {},
        {
          borderRadius: props.borderRadius || 0,
        },
      ]}
    >
      {props.children}
    </View>
  );
};

export default BevShadow;
