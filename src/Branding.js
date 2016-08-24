import React, { Component, PropTypes } from 'react';
import { Text, View } from 'react-native';

import {styles} from './Styles'

export default class Branding extends Component {
  static propTypes = {
    title: React.PropTypes.string,
  }

  static defaultProps = {
    title: "Bevegram"
  }

  render() {
    return(
      <View style={[{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }, styles.bevColorPrimary]}>
        <Text>{this.props.title}</Text>
      </View>
    );
  }
}
