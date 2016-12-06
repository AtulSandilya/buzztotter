import * as React from "react";
import { Component, PropTypes } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { globalColors } from './GlobalStyles';
import {isIOS, isAndroid, isNarrow} from '../Utilities';

interface Style {
  button: React.ViewStyle;
  greenButton: React.ViewStyle;
  buttonContainer: React.ViewStyle;
  buttonText: React.TextStyle;
  greenButtonText: React.TextStyle;
}

const styles = StyleSheet.create<Style>({
  button: {
    backgroundColor: globalColors.bevSecondary,
    borderColor: "#000000",
    borderRadius: 10,
    flex: -1,
    padding: 15,
    margin: 15,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#333333',
    shadowOpacity: 0.5,
    shadowRadius: 0.95,
    shadowOffset: {
      width: 2,
      height: 1,
    },
    elevation: 5,
  },
  greenButton: {
    backgroundColor: globalColors.bevPrimary,
  },
  buttonContainer: {
    flex: -1,
    flexDirection: 'row-reverse',
  },
  buttonText: {
    color: "#ffffff",
  },
  greenButtonText: {
    color: "#333333",
  },
})

// A button should be at least 44dp tall, and taller if the font size is
// larger than the default 12
export const getButtonHeight = (buttonFontSize = 12) => {
  const buttonHeight = 44 + (buttonFontSize - 12);

  return buttonHeight > 44 ? buttonHeight : 44;
}

const BevButton  = ({
  text,
  shortText,
  // Accessibility label and test label (Espresso accesses this with
  // "withContentDescription" )
  label,
  buttonFontSize = 12,
  onPress,
  rightIcon = false,
  margin = 12,
  showSpinner = false,
  showDisabled = false,
  isGreen = false,
  // In a row with two buttons if one has an icon it will be taller than the
  // button without the icon, this prop makes the icon button shorter, trying
  // to match the height of the adjacentButton
  adjacentButton = false,
  leftIcon = "",
  fontAwesomeLeftIcon = "",
  style = {},
}) => {
  const useShortText = isNarrow;
  const iconStyle =
    isAndroid ? {
      fontSize: buttonFontSize * 2,
      paddingVertical: -3
    } : {
      fontSize: buttonFontSize * 2,
      paddingTop: 2,
    }
  const smallIconStyle =
    isAndroid ? {
      fontSize: buttonFontSize * 1.5,
      paddingVertical: -3
    } : {
      fontSize: buttonFontSize * 1.5,
      paddingTop: 2,
    }

  const buttonHeight = getButtonHeight(buttonFontSize);

  const buttonStyle = StyleSheet.flatten([styles.button, style, isGreen ? styles.greenButton : {}]);
  const buttonTextStyle = isGreen ? styles.greenButtonText : styles.buttonText;
  const leftIconPadding = text !== "" ? 10 : 0;

  return (
    <View
      style={styles.buttonContainer}
      accessibilityLabel={label}
    >
      <TouchableHighlight
        onPress={onPress}
        underlayColor={"#ffffff"}
      >
        <View style={[buttonStyle,
          {margin: margin},
          showDisabled ? {backgroundColor: 'rgba(128, 128, 128, 0.5)'} : null,
          rightIcon || (leftIcon.length !== 0)? {paddingVertical: 11} : null,
          isNarrow ? {paddingVertical: 11} : null,
          {height: buttonHeight},
        ]}>
          {leftIcon.length !== 0 ?
            <Ionicon
              name={leftIcon}
              style={[buttonTextStyle, smallIconStyle, {paddingRight: leftIconPadding}]}
            />
          : null}
          {fontAwesomeLeftIcon.length !== 0 ?
            <FontAwesome
              name={fontAwesomeLeftIcon}
              style={[buttonTextStyle, smallIconStyle, {paddingRight: leftIconPadding}]}
            />
          : null}
          {showSpinner ?
            <ActivityIndicator
              color="#ffffff"
              animating={true}
              style={{
                flex: -1,
                paddingRight: 10,
              }}
            />
          : null}
          {text !== "" ?
            <Text
              numberOfLines={1}
              style={[
                buttonTextStyle,
                {fontSize: buttonFontSize}
            ]}>
              {useShortText ? shortText : text}
            </Text>
            : null
          }
          {rightIcon ?
            <Ionicon
              name={"ios-arrow-forward"}
              style={[buttonTextStyle, iconStyle, {paddingLeft: 10}]}
            />
            : null
          }
        </View>
      </TouchableHighlight>
    </View>
  )
}

export default BevButton;
