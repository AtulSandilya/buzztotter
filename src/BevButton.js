import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from './Styles'

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.bevColorSecondary,
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

export default class BevButton extends Component {
  static propTypes = {
    buttonText: React.PropTypes.string,
  }

  render() {
    return(
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{this.props.buttonText}</Text>
        </View>
      </View>
    );
  }
}
