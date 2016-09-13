import { Text, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import {globalStyles} from './components/GlobalStyles';

export default class TitleText extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
  }

  render() {
    return(
      <View style={globalStyles.titleTextContainer}>
        <Text style={globalStyles.titleText}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}
