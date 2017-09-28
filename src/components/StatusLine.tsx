import * as React from "react";
import { View } from "react-native";

import { EventStatus } from "../db/tables";

import theme from "../theme";
import BevIcon, { IconType } from "./BevIcon";
import BevLargerTitleText from "./BevLargerTitleText";

import { globalStyles } from "./GlobalStyles";

const StatusLineIcon = (iconName: IconType, color: string) => {
  return (
    <BevIcon
      iconType={iconName}
      size={"largeNormal"}
      color={color}
      style={{ paddingRight: 7 }}
    />
  );
};

const StatusLineActivityIndicator = () =>
  <BevIcon style={{ marginRight: 10 }} iconType={"spinner"} />;

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
  const successIcon = "success";
  const successColor = theme.colors.success;

  const failureIcon = "failure";
  const failureColor = theme.colors.failure;

  const indifferentIcon = "indifferent";
  const indifferentColor = "#999";

  if (status === "complete") {
    component = StatusLineIcon(successIcon, successColor);
  } else if ((somethingFailed && !thisFailed) || props.statusObject.error) {
    component = StatusLineIcon(indifferentIcon, indifferentColor);
  } else {
    switch (status) {
      case "pending":
      case "inProgress":
      default:
        component = StatusLineActivityIndicator();
        break;
      case "failed":
        component = StatusLineIcon(failureIcon, failureColor);
        break;
    }
  }

  return (
    <View style={globalStyles.bevLine}>
      <View style={globalStyles.bevLineLeft}>
        <BevLargerTitleText>
          {`${props.title}:`}
        </BevLargerTitleText>
      </View>
      <View style={globalStyles.bevLineRight}>
        {component}
      </View>
    </View>
  );
};

export default StatusLine;
