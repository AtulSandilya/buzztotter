import * as React from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";

import Color from "color";

import theme, { SizeName } from "../theme";

import BevIcon, { IconType } from "./BevIcon";
import BevShadow from "./BevShadow";
import BevText from "./BevText";

import * as Utils from "../ReactNativeUtilities";

// A button should be at least 44dp tall, and taller if the font size is
// larger than the default 12
export const getButtonHeight = (buttonFontSize = theme.font.size.normal) => {
  const minButtonHeight = 44;
  const buttonHeight =
    minButtonHeight + (buttonFontSize - theme.font.size.normal);

  return buttonHeight > minButtonHeight ? buttonHeight : minButtonHeight;
};

type ButtonType =
  | "primaryPositive"
  | "primaryNegative"
  | "secondary"
  | "secondaryNegative"
  | "tertiary"
  | "facebook";

/* tslint:disable:ban-types */
interface BevButtonProps {
  onPress: Function;
  shortText: string;
  text: string;
  children?: any;
  isListButton?: boolean;
  label?: string;
  fontSize?: SizeName;
  showSpinner?: boolean;
  iconType?: IconType;
  type?: ButtonType;
  rightArrow?: boolean;
}

interface BevButtonTypeProps {
  backgroundColor: string;
  borderColor?: string;
  textColor: string;
}

const BevButton: React.StatelessComponent<BevButtonProps> = props => {
  const buttonTouchedOpacity = 0.15;
  const text = Utils.isNarrow ? props.shortText : props.text;
  const fontSize =
    props.fontSize || (props.isListButton ? "normal" : "largeNormal");
  const iconSize = fontSize;
  const borderRadius = theme.borderRadius;
  const iconLeft = props.iconType !== undefined && props.type !== "tertiary";
  const iconRight = props.rightArrow !== undefined;

  const buildButtonTypeProps = (type: ButtonType): BevButtonTypeProps => {
    switch (type) {
      case "primaryPositive":
      default:
        return {
          backgroundColor: theme.colors.bevSecondary,
          borderColor: theme.colors.bevSecondary,
          textColor: theme.colors.white,
        };
      case "primaryNegative":
        return {
          backgroundColor: theme.colors.failureBg,
          borderColor: theme.colors.failureBg,
          textColor: theme.colors.white,
        };
      case "secondary":
        return {
          backgroundColor: theme.colors.bevPrimary,
          borderColor: theme.colors.bevPrimary,
          textColor: theme.colors.white,
        };
      case "secondaryNegative":
        return {
          backgroundColor: theme.colors.white,
          borderColor: theme.colors.uiLight,
          textColor: theme.colors.failureBg,
        };
      case "tertiary":
        return {
          backgroundColor: "transparent",
          textColor: theme.colors.uiTextColor,
        };
      case "facebook":
        return {
          backgroundColor: theme.colors.brands.facebook,
          textColor: theme.colors.white,
        };
    }
  };

  const buttonTypeProps = buildButtonTypeProps(props.type);

  const ButtonIcon = (buttonIconProps: { iconType: IconType }) => (
    <BevIcon
      iconType={buttonIconProps.iconType}
      size={iconSize}
      color={buttonTypeProps.textColor}
      style={{
        paddingHorizontal: theme.padding.normal,
        paddingVertical: theme.padding.small,
      }}
    />
  );

  return (
    <BevShadow
      borderRadius={borderRadius}
      hasShadow={props.type ? props.type.indexOf("tertiary") !== 0 : true}
    >
      <TouchableHighlight
        underlayColor={Color(buttonTypeProps.backgroundColor)
          .lighten(buttonTouchedOpacity)
          .hex()
          .toString()}
        onPress={() => props.onPress()}
        style={{
          backgroundColor: buttonTypeProps.backgroundColor,
          borderColor: buttonTypeProps.borderColor || undefined,
          borderRadius,
          borderWidth: buttonTypeProps.borderColor
            ? StyleSheet.hairlineWidth
            : 0,
          flex: -1,
        }}
      >
        <View style={{ flex: -1, flexDirection: "row", alignItems: "center" }}>
          {iconLeft ? <ButtonIcon iconType={props.iconType} /> : null}
          <BevText
            allCaps={false}
            color={buttonTypeProps.textColor}
            fontWeight="bold"
            isCondensed={true}
            size={fontSize}
            showTextShadow={theme.colors.white === buttonTypeProps.textColor}
            textStyle={{
              paddingLeft: iconLeft ? 0 : theme.padding.normal,
              paddingRight:
                iconRight || text.length === 0 ? 0 : theme.padding.normal,
              paddingVertical: theme.padding.small,
              top: Utils.isAndroid ? -1 : 0,
            }}
          >
            {text}
          </BevText>
          {props.showSpinner ? <ButtonIcon iconType={"spinner"} /> : null}
          {props.rightArrow ? <ButtonIcon iconType={"rightArrow"} /> : null}
        </View>
      </TouchableHighlight>
    </BevShadow>
  );
};

export default BevButton;
