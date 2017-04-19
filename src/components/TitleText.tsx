import * as React from "react";
import { Component } from 'react';
import { Text, View } from 'react-native';

import {globalStyles} from './GlobalStyles';

interface TitleTextProps {
  title: string;
}

const TitleText: React.StatelessComponent<TitleTextProps> = ({title}) => (
  <View style={globalStyles.titleTextContainer}>
    <Text style={globalStyles.titleText}>
      {title}
    </Text>
  </View>
)

export default TitleText;
