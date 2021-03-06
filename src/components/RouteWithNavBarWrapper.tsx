import * as React from "react";
import { RefreshControl, View, ViewStyle } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { NavBarHeight } from "../components/Branding";
import {
  StatusBarHeight,
  WindowHeight,
  WindowWidth,
} from "../ReactNativeUtilities";

import theme from "../theme";

interface RouteWithNavBarWrapperProps {
  viewBelowHeight?: number;
  children?: React.ReactChild;
  isRefreshing?: boolean;
  refreshText?: string;
  dismissKeyboardOnTouchOutsideKeyboard?: boolean;
  hasNavBar?: boolean;
  refreshAction?: () => void;
}

const RouteWithNavBarWrapper: React.StatelessComponent<
  RouteWithNavBarWrapperProps
> = props => {
  const extraScrollHeight = 30;
  const leftOffset = 0;
  const containerStyle: ViewStyle = {
    flex: 1,
    height:
      WindowHeight -
      (props.hasNavBar === false ? StatusBarHeight : NavBarHeight) -
      props.viewBelowHeight,
    left: leftOffset,
    top: props.hasNavBar === false ? StatusBarHeight : NavBarHeight,
    width: WindowWidth,
  };

  const refreshControlMargin = 50;
  const thisRefreshControl =
    props.refreshAction !== undefined ? (
      <RefreshControl
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
    ) : null;

  return (
    <KeyboardAwareScrollView
      style={containerStyle}
      extraScrollHeight={extraScrollHeight}
      refreshControl={thisRefreshControl}
      keyboardShouldPersistTaps={
        props.dismissKeyboardOnTouchOutsideKeyboard ? "never" : "always"
      }
    >
      <View>
        {props.children}
        <View style={{ height: NavBarHeight }} />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default RouteWithNavBarWrapper;
