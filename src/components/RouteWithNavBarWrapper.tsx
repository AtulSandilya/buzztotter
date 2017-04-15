import * as React from "react";
import { Component, PropTypes } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {NavBarHeight} from "../components/Branding";
import {WindowHeight, WindowWidth} from "../Utilities";

import theme from "../theme";

interface RouteWithNavBarWrapperProps {
  viewBelowHeight?: number;
  children?: React.ReactChild;
  isRefreshing?: boolean;
  refreshText?: string;
  refreshAction?: () => void;
}

const RouteWithNavBarWrapper: React.StatelessComponent<RouteWithNavBarWrapperProps> = (props) => {

  const extraScrollHeight = 30;
  const leftOffset = 0;

  return (
    <KeyboardAwareScrollView
      style={{
        flex: 1,
        height: WindowHeight - NavBarHeight - props.viewBelowHeight,
        left: leftOffset,
        top: NavBarHeight,
        width: WindowWidth,
      }}
      extraScrollHeight={extraScrollHeight}
      refreshControl={
        props.refreshAction !== undefined ?
          <RefreshControl
            refreshing={props.isRefreshing}
            onRefresh={() => {
              if (!props.isRefreshing) {
                props.refreshAction();
              }
            }}
            title={props.refreshText}
            tintColor={theme.colors.bevPrimary}
            progressViewOffset={50}
            colors={[theme.colors.bevPrimary]}
          />
        : null
      }
    >
      {props.children}
    </KeyboardAwareScrollView>
  );
};

export default RouteWithNavBarWrapper;
