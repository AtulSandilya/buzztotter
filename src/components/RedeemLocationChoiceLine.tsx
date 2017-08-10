import * as React from "react";
import { View } from "react-native";

import theme from "../theme";
import BevPressableLine from "./BevPressableLine";
import BevUiText from "./BevUiText";

import {
  PrettyFormatDistance,
  SquareFootageToRadius,
} from "../CommonUtilities";
import { DEFAULT_SQUARE_FOOTAGE, Location } from "../db/tables";
import { CalcSuccessFailColor } from "../ReactNativeUtilities";

interface RedeemLocationChoiceLineProps {
  loc: Location | undefined;
  isLoading: boolean;
  index: number;
  other?: boolean;
  onPress(): void;
}

const CalcColorFromDistance = (
  distance: number,
  squareFootage: number = DEFAULT_SQUARE_FOOTAGE,
): string => {
  const startRedDistance = SquareFootageToRadius(squareFootage);
  return CalcSuccessFailColor(distance, startRedDistance);
};

const RedeemLocationChoiceLine: React.StatelessComponent<
  RedeemLocationChoiceLineProps
> = props => {
  const errorText = "Not Found!";
  const isLoadingText = `${props.index}.`;
  const titleText = props.isLoading
    ? isLoadingText
    : props.loc ? `${props.index}. ${props.loc.name}` : errorText;

  const addressText = props.isLoading
    ? "..."
    : props.loc ? props.loc.address : "?";

  const distanceText = props.isLoading
    ? "..."
    : props.loc
      ? PrettyFormatDistance(
          props.loc.distanceFromUser,
          "imperial",
          props.loc.squareFootage,
          "You are here?",
        )
      : "?";

  const defaultColor = theme.colors.text;

  const content = props.other
    ? <BevUiText
        fontSize="massive"
        iconSize="large"
        preserveCase={true}
        style={{ marginBottom: 5 }}
        color={defaultColor}
      >
        {`${props.index}. ${props.isLoading ? "" : "Other"}`}
      </BevUiText>
    : <View>
        <BevUiText
          fontSize="massive"
          iconSize="large"
          preserveCase={true}
          style={{ marginBottom: 5 }}
          color={defaultColor}
        >
          {titleText}
        </BevUiText>
        {!props.isLoading
          ? <View>
              <BevUiText
                icon="globe"
                fontSize="large"
                preserveCase={true}
                style={{ marginBottom: 5 }}
                color={defaultColor}
              >
                {addressText}
              </BevUiText>
              <BevUiText
                icon="map-marker"
                fontSize="large"
                preserveCase={true}
                color={
                  props.isLoading
                    ? defaultColor
                    : props.loc
                      ? CalcColorFromDistance(props.loc.distanceFromUser)
                      : defaultColor
                }
              >
                {distanceText}
              </BevUiText>
            </View>
          : null}
      </View>;

  return (
    <BevPressableLine
      onPress={props.onPress}
      noHorizontalPadding={true}
      showRightArrow={props.loc || props.other === true ? true : false}
      showLoading={props.isLoading ? true : false}
    >
      {content}
    </BevPressableLine>
  );
};

export default RedeemLocationChoiceLine;
