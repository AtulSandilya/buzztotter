import * as React from "react";
import { Component } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import theme from "../theme";

import {globalColors} from "./GlobalStyles";

interface BevUiTextProps {
  children?: React.ReactChild;
  fontSize?: "large" | "normal";
  icon?: string;
  iconSize?: "large" | "normal";
  iconBold?: boolean;
  isButton?: boolean;
  morePaddingAfterIcon?: boolean;
  style?: ViewStyle;
  color?: string;
  preserveCase?: boolean;
}

const BevUiText: React.StatelessComponent<BevUiTextProps> = props => {
  const normalFontSize = 9;
  const fontLargeMultiplier = 1.25;
  const fontSize = props.fontSize === "large"
    ? normalFontSize * fontLargeMultiplier
    : normalFontSize;

  const iconNormalMultiplier = 1.25;
  const iconLargeMultiplier = 2;
  const iconSize = props.iconSize === "large"
    ? fontSize * iconLargeMultiplier
    : fontSize * iconNormalMultiplier;

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
              width: iconSize * iconNormalMultiplier,
            }}
          >
            <FontAwesome
              name={props.icon}
              style={{
                color,
                fontSize: iconSize,
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
