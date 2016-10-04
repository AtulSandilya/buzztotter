import * as React from "react";
import { Component, PropTypes } from 'react';
import { Text, View } from 'react-native';

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
