import * as React from "react";
import { Component, PropTypes } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {NavBarHeight} from "../components/Branding";
import {WindowHeight, WindowWidth} from "../Utilities";

interface RouteWithNavBarWrapperProps {
  viewBelowHeight?: number;
  children?: React.ReactChild;
}

const RouteWithNavBarWrapper: React.StatelessComponent<RouteWithNavBarWrapperProps> = ({
  children,
  viewBelowHeight = 0,
}) => {

  const extraScrollHeight = 30;
  const leftOffset = 0;

  return (
    <KeyboardAwareScrollView
      style={{
        flex: 1,
        height: WindowHeight - NavBarHeight - viewBelowHeight,
        left: leftOffset,
        top: NavBarHeight,
        width: WindowWidth,
      }}
      extraScrollHeight={extraScrollHeight}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

export default RouteWithNavBarWrapper;
