import * as React from "react";
import { Component, PropTypes } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { globalColors } from './GlobalStyles';
import {isIOS, isAndroid} from '../Utilities';

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
  buttonText,
  buttonFontSize = 12,
  bevButtonPressed,
  rightIcon = false,
  margin = 12,
  showSpinner = false,
  showDisabled = false,
}) => (
  <View style={styles.buttonContainer}>
    <TouchableHighlight
      onPress={bevButtonPressed}
      underlayColor={"#ffffff"}
    >
      <View style={[styles.button, {margin: margin}, showDisabled ? {backgroundColor: 'rgba(128, 128, 128, 0.5)'} : null, rightIcon ? {paddingVertical: 10} : null, ]}>
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
        <Text style={[styles.buttonText, {fontSize: buttonFontSize}]}>{buttonText}</Text>
        {rightIcon ?
          <Icon
            name={"ios-arrow-forward"}
            style={[styles.buttonText,  isAndroid ? {
              fontSize: buttonFontSize * 2,
              paddingLeft: 10,
              paddingVertical: -3
            } : {
              fontSize: buttonFontSize * 2,
              paddingLeft: 10,
              paddingTop: 2,
            }]}
          />
          : null
        }
      </View>
    </TouchableHighlight>
  </View>
);

export default BevButton;
