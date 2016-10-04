import * as React from "react";
import { Component, PropTypes } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { globalColors } from './GlobalStyles';

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
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  buttonText: {
    color: "#ffffff",
  },
})

const BevButton  = ({buttonText, buttonFontSize = 12, bevButtonPressed}) => (
  <View style={styles.buttonContainer}>
    <TouchableHighlight
      onPress={bevButtonPressed}
      underlayColor={"#ffffff"}
    >
      <View style={styles.button}>
        <Text style={[styles.buttonText, {fontSize: buttonFontSize}]}>{buttonText}</Text>
      </View>
    </TouchableHighlight>
  </View>
);

export default BevButton;
