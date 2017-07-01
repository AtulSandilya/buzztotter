import * as React from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";

import { globalColors } from "./GlobalStyles";

import RightArrow from "./RightArrow";

interface BevPressableLineProps {
  onPress: () => void;
  children?: React.ReactChild;
  showTopBorder?: boolean;
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
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          {props.children}
        </View>
        <View style={{ flex: -1 }}>
          <RightArrow />
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default BevPressableLine;
