import * as React from "react";
import { Component, PropTypes } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {NavBarHeight} from '../routers/InitialRouter';
import {WindowHeight, WindowWidth} from '../Utilities';

interface RouteWithNavBarWrapperProps {
  viewBelowHeight?: number;
  children?: React.ReactChild;
}

const RouteWithNavBarWrapper: React.StatelessComponent<RouteWithNavBarWrapperProps> = ({children, viewBelowHeight = 0}) => {
  const topMargin = NavBarHeight;
  return (
    <KeyboardAwareScrollView
      style={{
        flex: 1,
        position: 'absolute',
        top: NavBarHeight,
        left: 0,
        height: WindowHeight - NavBarHeight - viewBelowHeight,
        width: WindowWidth,
      }}
    >
      {children}
    </KeyboardAwareScrollView>
  )
}

export default RouteWithNavBarWrapper;
