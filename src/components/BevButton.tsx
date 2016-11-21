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

import Icon from 'react-native-vector-icons/Ionicons';

import { globalColors } from './GlobalStyles';
import {isIOS, isAndroid, isNarrow} from '../Utilities';

interface Style {
  button: React.ViewStyle;
  buttonContainer: React.ViewStyle;
  buttonText: React.TextStyle;
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
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  buttonText: {
    color: "#ffffff",
  },
})

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
  // In a row with two buttons if one has an icon it will be taller than the
  // button without the icon, this prop makes the icon button shorter, trying
  // to match the height of the adjacentButton
  adjacentButton = false,
  leftIcon = "",
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

  return (
    <View
      style={styles.buttonContainer}
      accessibilityLabel={label}
    >
      <TouchableHighlight
        onPress={onPress}
        underlayColor={"#ffffff"}
      >
        <View style={[styles.button,
          {margin: margin},
          showDisabled ? {backgroundColor: 'rgba(128, 128, 128, 0.5)'} : null,
          rightIcon || (leftIcon.length !== 0)? {paddingVertical: 11} : null,
          isNarrow ? {paddingVertical: 11} : null
        ]}>
          {leftIcon.length !== 0 ?
            <Icon
              name={leftIcon}
              style={[styles.buttonText, smallIconStyle, {paddingRight: 10}]}
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
          <Text style={[styles.buttonText, {fontSize: buttonFontSize}]}>{useShortText ? shortText : text}</Text>
          {rightIcon ?
            <Icon
              name={"ios-arrow-forward"}
              style={[styles.buttonText, iconStyle, {paddingLeft: 10}]}
            />
            : null
          }
        </View>
      </TouchableHighlight>
    </View>
  )
}

export default BevButton;
