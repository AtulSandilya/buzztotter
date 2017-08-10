import * as React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import theme from "../theme";
import { globalStyles } from "./GlobalStyles";

type BevUiSizeType = "massive" | "huge" | "large" | "normal" | "small";

interface BevUiTextProps {
  children?: React.ReactChild;
  text?: string;
  fontSize?: BevUiSizeType;
  fontStyle?: TextStyle;
  icon?: string;
  iconSize?: BevUiSizeType;
  iconRight?: boolean;
  iconBold?: boolean;
  isButton?: boolean;
  morePaddingAfterIcon?: boolean;
  style?: ViewStyle;
  color?: string;
  preserveCase?: boolean;
  calculatedColor?: () => string;
  hero?: boolean;
}

const baseSize = 9;
const multiplier = 1.25;
const iconMultiplier = 0.75;

const calcSize = (
  size: BevUiSizeType = "normal",
  context: "font" | "icon",
): number => {
  let result: number;

  /* tslint:disable:no-magic-numbers */
  switch (size) {
    case "massive":
      result = baseSize * Math.pow(multiplier, 4);
      break;
    case "huge":
      result = baseSize * Math.pow(multiplier, 3);
      break;
    case "large":
      result = baseSize * Math.pow(multiplier, 2);
      break;
    case "small":
      result = baseSize / Math.pow(multiplier, 2);
      break;
    default:
    case "normal":
      result = baseSize;
      break;
  }

  const shouldUseIconMultiplier =
    context === "icon" && (size === "massive" || size === "huge");

  return Math.round(result * (shouldUseIconMultiplier ? iconMultiplier : 1));
};

const BevUiText: React.StatelessComponent<BevUiTextProps> = props => {
  const fontSize = calcSize(props.fontSize, "font");
  const iconSize = calcSize(
    props.iconSize ? props.iconSize : props.fontSize,
    "icon",
  );

  const text = props.text
    ? props.text
    : typeof props.children !== "string"
      ? ""
      : props.preserveCase ? props.children : props.children.toUpperCase();

  const color = typeof props.calculatedColor === "function"
    ? props.calculatedColor()
    : props.color
      ? props.color
      : props.iconBold
        ? theme.colors.uiBoldTextColor
        : theme.colors.uiTextColor;

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
              paddingLeft: props.iconRight ? 13 : undefined,
            }
          : {},
      ]}
    >
      {props.icon && !props.iconRight && !props.hero
        ? <View
            style={{
              alignItems: "center",
              marginRight: props.morePaddingAfterIcon ? 10 : 4,
              width: fontSize * multiplier,
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
        style={[
          { fontSize },
          props.hero ? globalStyles.smallerHeroText : {},
          {
            color: props.color ? props.color : color,
          },
          props.fontStyle,
        ]}
      >
        {text}
      </Text>
      {props.icon && props.iconRight && !props.hero
        ? <View
            style={{
              alignItems: "center",
              marginLeft: props.morePaddingAfterIcon ? 10 : 4,
              width: fontSize * multiplier,
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
    </View>
  );
};

export default BevUiText;
