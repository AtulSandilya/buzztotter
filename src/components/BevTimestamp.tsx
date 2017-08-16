import * as React from "react";
import { View, ViewStyle } from "react-native";

import TimeAgo from "react-timeago";

import { CalcSuccessFailColor, isAndroid } from "../ReactNativeUtilities";

import BevUiText from "./BevUiText";

interface BevTimestampProps {
  date: number;
  colorThreshold?: number;
  size?: string;
  style?: ViewStyle;
  preserveCase?: boolean;
  hero?: boolean;
}

const BevTimestamp: React.StatelessComponent<BevTimestampProps> = props => {
  const millisPerSecond = 1000;
  const secondsPerMinute = 60;
  const maxPeriodMinutes = 2;
  const maxPeriod = millisPerSecond * secondsPerMinute * maxPeriodMinutes;
  return (
    <View style={[{ flex: -1 }, props.style]}>
      <TimeAgo
        calculatedColor={
          props.colorThreshold
            ? () => {
                return CalcSuccessFailColor(
                  Date.now() - props.date,
                  props.colorThreshold,
                  true,
                );
              }
            : undefined
        }
        date={props.date}
        component={BevUiText}
        fontSize={props.size}
        style={props.style}
        icon="clock-o"
        formatter={(value, unit, suffix) => {
          if (unit === "second") {
            return "A few seconds ago";
          } else {
            return `${value} ${unit}${value > 1 ? "s" : ""} ${suffix}`;
          }
        }}
        // Android doesn't handle long timeouts properly
        maxPeriod={isAndroid ? maxPeriod : Infinity}
        {...props}
      />
    </View>
  );
};

export default BevTimestamp;
