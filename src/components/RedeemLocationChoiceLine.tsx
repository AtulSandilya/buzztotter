import * as React from "react";
import { View } from "react-native";

import { Location } from "../db/tables";
import theme from "../theme";

import BevLargerTitleText from "./BevLargerTitleText";
import BevPressableLine from "./BevPressableLine";
import LocationAddressAndDistance from "./LocationAddressAndDistance";

interface RedeemLocationChoiceLineProps {
  loc: Location | undefined;
  isLoading: boolean;
  index: number;
  other?: boolean;
  onPress(): void;
}

const RedeemLocationChoiceLine: React.StatelessComponent<
  RedeemLocationChoiceLineProps
> = props => {
  const errorText = "Not Found!";
  const isLoadingText = `${props.index}.`;
  const titleText = props.isLoading
    ? isLoadingText
    : props.loc ? `${props.index}. ${props.loc.name}` : errorText;

  const content = props.other ? (
    <BevLargerTitleText>
      {`${props.index}. ${props.isLoading ? "" : "Other"}`}
    </BevLargerTitleText>
  ) : (
    <View>
      <BevLargerTitleText>{titleText}</BevLargerTitleText>
      {!props.isLoading ? (
        <LocationAddressAndDistance
          loc={props.loc}
          paddingLeft={theme.padding.small}
          calcColorFromDistance={true}
        />
      ) : null}
    </View>
  );

  return (
    <BevPressableLine
      onPress={props.onPress}
      noHorizontalPadding={true}
      showLoading={props.isLoading ? true : false}
    >
      {content}
    </BevPressableLine>
  );
};

export default RedeemLocationChoiceLine;
