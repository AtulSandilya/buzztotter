import { Text, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import {globalStyles} from './GlobalStyles';

const TitleText = ({title}) => (
  <View style={globalStyles.titleTextContainer}>
    <Text style={globalStyles.titleText}>
      {title}
    </Text>
  </View>
)

TitleText.propTypes = {
  title: React.PropTypes.string.isRequired,
}

export default TitleText;
