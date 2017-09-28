import * as React from "react";
import { View } from "react-native";

import {
  PrettyFormatDistance,
  SquareFootageToRadius,
} from "../CommonUtilities";
import { DEFAULT_SQUARE_FOOTAGE, Location } from "../db/tables";
import { CalcSuccessFailColor } from "../ReactNativeUtilities";
import theme from "../theme";
import { FormatDayHours } from "./LocationDetail";

import BevUiText from "./BevUiText";

interface LocationAddressAndDistanceProps {
  loc: Location;
  paddingLeft?: number;
  paddingTop?: number;
  calcColorFromDistance?: boolean;
  showHours?: boolean;
}

const CalcColorFromDistance = (
  distance: number,
  squareFootage: number = DEFAULT_SQUARE_FOOTAGE,
): string => {
  const startRedDistance = SquareFootageToRadius(squareFootage);
  return CalcSuccessFailColor(distance, startRedDistance);
};

const LocationAddressAndDistance: React.StatelessComponent<
  LocationAddressAndDistanceProps
> = props => {
  const addressText = props.loc.address || "?";

  const distanceText = props.loc.distanceFromUser
    ? PrettyFormatDistance(
        props.loc.distanceFromUser,
        "imperial",
        props.loc.squareFootage,
        "You are here",
      )
    : "?";

  const todayAsNumber = new Date().getDay();

  // Let BevUiText control the icon color
  const defaultColor = undefined;

  const firstItemPadding = {
    paddingBottom: theme.padding.extraSmall,
    paddingTop: props.paddingTop || theme.padding.extraSmall,
  };

  return (
    <View style={{ flex: -1, paddingLeft: props.paddingLeft || 0 }}>
      {!props.showHours
        ? <BevUiText
            icon="address"
            iconWidth={theme.padding.extraLarge}
            style={firstItemPadding}
          >
            {addressText}
          </BevUiText>
        : null}
      <BevUiText
        icon="location"
        iconWidth={theme.padding.extraLarge}
        style={props.showHours ? firstItemPadding : {}}
        color={
          props.loc && props.calcColorFromDistance
            ? CalcColorFromDistance(props.loc.distanceFromUser)
            : defaultColor
        }
      >
        {distanceText}
      </BevUiText>
      {props.showHours
        ? <BevUiText icon="time" iconWidth={theme.padding.extraLarge}>
            {FormatDayHours(props.loc.typicalHours[todayAsNumber])}
          </BevUiText>
        : null}
    </View>
  );
};

export default LocationAddressAndDistance;
