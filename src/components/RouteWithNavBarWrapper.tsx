import * as React from "react";
import { Component, PropTypes } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {isIOS, isAndroid} from '../Utilities';

interface RouteWithNavBarWrapperProps {
  children?: React.ReactChild;
}

const RouteWithNavBarWrapper: React.StatelessComponent<RouteWithNavBarWrapperProps> = ({children}) => {
  const topMargin = isIOS ? 64 : isAndroid ? 54 : 0
  return (
    <ScrollView style={{flex: 1}}>
      <View style={{height: topMargin}} />
        {children}
    </ScrollView>
  )
}

export default RouteWithNavBarWrapper;
