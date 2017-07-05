import * as React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { EventStatus } from "../db/tables";

import theme from "../theme";

import { globalStyles } from "./GlobalStyles";

const iconSize = 30;

const StatusLineIcon = (iconName: string, color: string) => {
  return (
    <FontAwesome
      name={iconName}
      size={iconSize}
      color={color}
      style={{ paddingRight: 7 }}
    />
  );
};

const StatusLineActivityIndicator = (isSpinning: boolean = true) =>
  <ActivityIndicator style={{ marginRight: 10 }} animating={isSpinning} />;

interface StatusLineProps {
  statusKey: string;
  statusObject: any;
  title: string;
}

const StatusLine = (props: StatusLineProps) => {
  const failedKeys = Object.keys(props.statusObject).filter(key => {
    return props.statusObject[key] === "failed";
  });

  const somethingFailed = failedKeys.length > 0;
  const thisFailed = failedKeys.indexOf(props.statusKey) !== -1;

  const status: EventStatus = props.statusObject[props.statusKey];

  let component;
  const successIcon = "check-circle-o";
  const successColor = theme.colors.success;

  const failureIcon = "times-circle-o";
  const failureColor = theme.colors.failure;
  if ((somethingFailed && !thisFailed) || props.statusObject.error) {
    component = StatusLineIcon(failureIcon, "#999");
  } else {
    switch (status) {
      case "pending":
      case "inProgress":
      default:
        component = StatusLineActivityIndicator();
        break;
      case "complete":
        component = StatusLineIcon(successIcon, successColor);
        break;
      case "failed":
        component = StatusLineIcon(failureIcon, failureColor);
        break;
    }
  }

  return (
    <View style={globalStyles.bevLine}>
      <View style={globalStyles.bevLineLeft}>
        <Text style={globalStyles.bevLineTextTitle}>
          {props.title}:
        </Text>
      </View>
      <View style={globalStyles.bevLineRight}>
        {component}
      </View>
    </View>
  );
};

export default StatusLine;
