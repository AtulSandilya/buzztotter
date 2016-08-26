import { Text, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import {styles} from './Styles.js'

export default class TitleText extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
  }

  render() {
    return(
      <View style={styles.titleTextContainer}>
        <Text style={styles.titleText}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}
