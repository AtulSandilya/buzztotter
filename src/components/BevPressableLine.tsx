import * as React from "react";

import {
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";

import { globalColors } from "./GlobalStyles";

import theme from "../theme";

import RightArrow from "./RightArrow";

interface BevPressableLineProps {
  onPress: () => void;
  children?: React.ReactChild;
  showTopBorder?: boolean;
  showRightArrow?: boolean;
  showLoading?: boolean;
  noHorizontalPadding?: boolean;
}

const BevPressableLine: React.StatelessComponent<
  BevPressableLineProps
> = props => {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={{ flex: 1 }}
      underlayColor={"#ffffff"}
    >
      <View
        style={{
          alignItems: "center",
          borderBottomColor: globalColors.subtleSeparator,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderTopColor: globalColors.subtleSeparator,
          borderTopWidth: props.showTopBorder ? StyleSheet.hairlineWidth : 0,
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: props.noHorizontalPadding
            ? 0
            : theme.padding.default,
          paddingVertical: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          {props.children}
        </View>
        <View style={{ flex: -1 }}>
          {props.showLoading
            ? <ActivityIndicator />
            : props.showRightArrow ? <RightArrow /> : null}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default BevPressableLine;
