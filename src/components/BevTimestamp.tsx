import * as React from "react";
import { Component } from "react";
import {View, ViewStyle} from "react-native";

import TimeAgo from "react-timeago";

import BevUiText from "./BevUiText";

interface BevTimestampProps {
  date: number;
  style?: ViewStyle;
}

const BevTimestamp: React.StatelessComponent<BevTimestampProps> = (props) => {
  return (
    <View style={[{flex: -1}, props.style]}>
      <TimeAgo
        date={props.date}
        component={BevUiText}
        style={props.style}
        icon="clock-o"
        formatter={(value, unit, suffix) => {
          if (unit === "second") {
            return "A few seconds ago";
          } else {
            return `${value} ${unit}${value > 1 ? "s" : ""} ${suffix}`;
          }
        }}
      />
    </View>
  );
};

export default BevTimestamp;
