import * as React from "react";
import { TextStyle, View, ViewStyle } from "react-native";

import * as Utils from "../ReactNativeUtilities";
import theme, { SizeName } from "../theme";

import BevIcon, { IconType } from "./BevIcon";
import BevText from "./BevText";

export interface BevUiTextProps {
  children?: React.ReactChild;
  text?: string;
  fontSize?: SizeName;
  fontStyle?: TextStyle;
  icon?: IconType;
  iconColor?: string;
  iconSize?: SizeName;
  iconRight?: boolean;
  iconBold?: boolean;
  iconWidth?: number;
  morePaddingAfterIcon?: boolean;
  style?: ViewStyle;
  color?: string;
  preserveCase?: boolean;
  calculatedColor?: () => string;
  hero?: boolean;
}

const BevUiText: React.StatelessComponent<BevUiTextProps> = props => {
  const fontSize = props.fontSize
    ? props.fontSize
    : props.hero ? "largeNormal" : "small";
  const text = props.children;

  const color =
    typeof props.calculatedColor === "function"
      ? props.calculatedColor()
      : props.color
        ? props.color
        : props.iconBold
          ? theme.colors.uiBoldTextColor
          : theme.colors.uiTextColor;

  return (
    <View
      style={[
        {
          alignItems: "center",
          flex: -1,
          flexDirection: "row",
          margin: 0,
          padding: 0,
        },
        props.style,
      ]}
    >
      {props.icon && !props.iconRight ? (
        <BevIcon
          color={props.iconColor || theme.colors.uiIconColor}
          iconType={props.icon}
          size={props.hero ? "largeNormal" : props.fontSize || "normal"}
          style={{
            alignItems: "center",
            paddingRight: props.morePaddingAfterIcon
              ? theme.padding.largeNormal
              : theme.padding[fontSize],
            width: props.iconWidth || undefined,
          }}
        />
      ) : (
        <View />
      )}
      <BevText
        allCaps={props.hero || props.preserveCase ? false : true}
        color={color}
        isCondensed={props.hero ? false : true}
        size={fontSize}
        fontWeight={props.hero || props.preserveCase ? "normal" : "bold"}
        textStyle={{
          margin: 0,
          // Android renders text with a small margin above, is enough to make
          // the text and the icon look like they are misaligned, this
          // corrects the alignment by moving the text up a little
          /* tslint:disable:no-magic-numbers */
          paddingBottom:
            Utils.isAndroid && props.icon && !props.iconRight ? 1 : 0,
          // iOS has the opposite problem
          paddingTop: Utils.isIOS && props.icon ? 2 : 0,
        }}
      >
        {text}
      </BevText>
      {props.icon && props.iconRight ? (
        <BevIcon
          color={theme.colors.uiIconColor}
          iconType={props.icon}
          size={props.hero ? "large" : "normal"}
          style={{
            marginLeft: props.morePaddingAfterIcon
              ? theme.padding.normal
              : theme.padding.extraSmall,
            padding: 0,
            width: props.iconWidth || undefined,
          }}
        />
      ) : (
        <View />
      )}
    </View>
  );
};

export default BevUiText;
