import * as React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

import theme, { FontWeight, SizeName } from "../theme";

interface BevTextStyleProps {
  allCaps?: boolean;
  color?: string;
  fontWeight?: FontWeight;
  showTextShadow?: boolean;
  isCondensed?: boolean;
  lineHeight?: SizeName;
  size?: SizeName;
  textStyle?: TextStyle;
  underline?: boolean;
}

interface BevTextProps extends BevTextStyleProps {
  children: React.ReactChild;
  [additionalProp: string]: any;
}

export const buildBevTextStyle = (props: BevTextStyleProps): TextStyle => {
  const fontSize = props.size
    ? theme.font.size[props.size]
    : theme.font.size.normal;

  return StyleSheet.flatten([
    {
      backgroundColor: "transparent",
      color: props.color || "#333333",
      fontFamily: props.isCondensed
        ? theme.font.condensedFamily
        : theme.font.family,
      fontSize,
      fontWeight: props.fontWeight
        ? theme.font.weight[props.fontWeight]
        : props.isCondensed ? theme.font.weight.bold : theme.font.weight.normal,
      letterSpacing:
        props.allCaps && fontSize < theme.font.size.smallNormal
          ? theme.font.allCapsLetterSpacing
          : undefined,
      get lineHeight() {
        const lineHeight = props.lineHeight
          ? theme.font.lineHeight[props.lineHeight]
          : props.size
            ? theme.font.lineHeight[props.size]
            : theme.font.lineHeight.normal;

        return fontSize * lineHeight;
      },
      textAlignVertical: "center",
    },
    props.underline ? { textDecorationLine: "underline" } : undefined,
    props.showTextShadow || props.color === theme.colors.white
      ? textShadowForWhiteText
      : {},
    props.textStyle,
  ]);
};

export const textShadowForWhiteText = {
  textShadowColor: "rgba(0, 0, 0, 0.25)",
  textShadowOffset: {
    height: 1,
    width: 0,
  },
  textShadowRadius: 2,
};

const BevText: React.StatelessComponent<BevTextProps> = props => {
  const text =
    typeof props.children !== "string"
      ? ""
      : props.allCaps
        ? props.children.toString().toUpperCase()
        : props.children;

  return (
    <Text style={buildBevTextStyle(props)} {...props}>
      {text}
    </Text>
  );
};

export default BevText;
