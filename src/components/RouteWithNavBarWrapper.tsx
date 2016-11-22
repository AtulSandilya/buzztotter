import * as React from "react";
import { Component, PropTypes } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {isIOS, isAndroid} from '../Utilities';

interface RouteWithNavBarWrapperProps {
  children?: React.ReactChild;
}

const RouteWithNavBarWrapper: React.StatelessComponent<RouteWithNavBarWrapperProps> = ({children}) => {
  const topMargin = isIOS ? 64 : isAndroid ? 54 : 0
  return (
    <KeyboardAwareScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={{flex: 1}}
    >
      <View style={{height: topMargin}} />
        {children}
    </KeyboardAwareScrollView>
  )
}

export default RouteWithNavBarWrapper;
