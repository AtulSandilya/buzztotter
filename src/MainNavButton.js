import { Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import {styles} from './Styles.js'

export default class MainNavButton extends Component {

  static propTypes = {
    label: React.PropTypes.string,
    isActive: React.PropTypes.bool,
    position: React.PropTypes.number,
    updateMenuPosition: React.PropTypes.func,
  }

  static defaultProps = {
    label: "Button",
    isActive: false,
    position: 0,
  }

  handlePress() {
    // Send the clicked button position to the parent
    this.props.updateMenuPosition(this.props.position);
  }

  render() {
    return(
      <TouchableHighlight
        onPress={this.handlePress.bind(this)}
        style={{flex: 1}}
      >
        <View style={[{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }, this.props.isActive ? styles.bevColorActiveSecondary : styles.bevColorSecondary]}>
          <Text
            style={styles.whiteText}
          >
          {this.props.label}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
