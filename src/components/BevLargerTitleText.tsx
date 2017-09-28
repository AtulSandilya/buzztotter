import * as React from "react";
import { StyleSheet, TextStyle } from "react-native";

import theme from "../theme";

import { BevLargerTextSize } from "./BevLargerText";
import BevText from "./BevText";

const BevLargerTitleText = (props: {
  children: string;
  noPadding?: boolean;
  textStyle?: TextStyle;
}) => {
  const text = props.children;

  return (
    <BevText
      size={BevLargerTextSize}
      fontWeight="bold"
      textStyle={StyleSheet.flatten([
        {
          marginLeft: props.noPadding ? 0 : theme.margin.small,
        },
        props.textStyle || {},
      ])}
    >
      {text}
    </BevText>
  );
};

export default BevLargerTitleText;
