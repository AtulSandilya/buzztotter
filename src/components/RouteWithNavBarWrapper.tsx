import * as React from "react";
import { Component } from "react";
import { RefreshControl, StyleSheet, View, ViewStyle } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { NavBarHeight } from "../components/Branding";
import { WindowHeight, WindowWidth } from "../ReactNativeUtilities";

import theme from "../theme";

interface RouteWithNavBarWrapperProps {
  viewBelowHeight?: number;
  children?: React.ReactChild;
  isRefreshing?: boolean;
  refreshText?: string;
  dismissKeyboardOnTouchOutsideKeyboard?: boolean;
  refreshAction?: () => void;
}

const RouteWithNavBarWrapper: React.StatelessComponent<
  RouteWithNavBarWrapperProps
> = props => {
  const extraScrollHeight = 30;
  const leftOffset = 0;
  const extraHeightForExpand = 150;
  const containerStyle: ViewStyle = {
    flex: 1,
    height: WindowHeight - NavBarHeight - props.viewBelowHeight,
    left: leftOffset,
    top: NavBarHeight,
    width: WindowWidth,
  };

  const refreshControlMargin = 50;
  const thisRefreshControl = props.refreshAction !== undefined
    ? <RefreshControl
        refreshing={props.isRefreshing}
        onRefresh={() => {
          if (!props.isRefreshing) {
            props.refreshAction();
          }
        }}
        title={props.refreshText}
        tintColor={theme.colors.bevPrimary}
        progressViewOffset={refreshControlMargin}
        colors={[theme.colors.bevPrimary]}
      />
    : null;

  return (
    <KeyboardAwareScrollView
      style={containerStyle}
      extraScrollHeight={extraScrollHeight}
      refreshControl={thisRefreshControl}
      keyboardShouldPersistTaps={
        props.dismissKeyboardOnTouchOutsideKeyboard ? "never" : "always"
      }
    >
      {props.children}
    </KeyboardAwareScrollView>
  );
};

export default RouteWithNavBarWrapper;
