import * as React from "react";
import { Component } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import theme from "../theme";

import { globalColors } from "./GlobalStyles";

type BevUiSizeType = "huge" | "large" | "normal" | "small";

interface BevUiTextProps {
  children?: React.ReactChild;
  fontSize?: BevUiSizeType;
  icon?: string;
  iconSize?: BevUiSizeType;
  iconBold?: boolean;
  isButton?: boolean;
  morePaddingAfterIcon?: boolean;
  style?: ViewStyle;
  color?: string;
  preserveCase?: boolean;
}

const baseSize = 9;
const multiplier = 1.25;
const iconMultiplier = 1.5;

const calcSize = (size: BevUiSizeType, context: "font" | "icon"): number => {
  let result: number;

  /* tslint:disable:no-magic-numbers */
  switch (size) {
    case "huge":
      result = baseSize * Math.pow(multiplier, 2);
      break;
    case "large":
      result = baseSize * Math.pow(multiplier, 1);
      break;
    case "small":
      result = baseSize / Math.pow(multiplier, 2);
      break;
    default:
    case "normal":
      result = baseSize;
      break;
  }

  return Math.round(result * (context === "icon" ? iconMultiplier : 1));
};

const BevUiText: React.StatelessComponent<BevUiTextProps> = props => {
  const fontSize = calcSize(props.fontSize, "font");
  const iconSize = calcSize(
    props.iconSize ? props.iconSize : props.fontSize,
    "icon",
  );

  const iconStyle = props.icon ? { paddingLeft: 8 } : undefined;
  const text = typeof props.children !== "string"
    ? ""
    : props.preserveCase ? props.children : props.children.toUpperCase();

  let color: string;

  if (props.color) {
    color = props.color;
  } else if (props.iconBold) {
    color = theme.colors.uiBoldTextColor;
  } else {
    color = theme.colors.uiTextColor;
  }

  /* tslint:disable:jsx-alignment */
  return (
    <View
      style={[
        { flex: -1, flexDirection: "row", alignItems: "center" },
        props.style,
        props.isButton
          ? {
              borderColor: color,
              borderRadius: 3,
              borderWidth: StyleSheet.hairlineWidth,
              padding: 7,
            }
          : {},
      ]}
    >
      {props.icon
        ? <View
            style={{
              alignItems: "center",
              marginRight: props.morePaddingAfterIcon ? 10 : 4,
              width: iconSize,
            }}
          >
            <FontAwesome
              name={props.icon}
              style={{
                color,
              }}
            />
          </View>
        : <View />}
      <Text
        style={{
          color: props.color ? props.color : color,
          fontSize,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export default BevUiText;
