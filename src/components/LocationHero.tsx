import * as React from "react";
import { View } from "react-native";

import { Location } from "../db/tables";
import theme from "../theme";

import BevText from "./BevText";
import LocationAddressAndDistance from "./LocationAddressAndDistance";

interface LocationHeroProps {
  loc: Location;
}

const LocationHero: React.StatelessComponent<LocationHeroProps> = props => {
  return (
    <View>
      <BevText
        fontWeight="light"
        size="extraLarge"
        color={theme.colors.uiTextColor}
      >
        {props.loc.name}
      </BevText>
      <LocationAddressAndDistance loc={props.loc} paddingTop={0} />
    </View>
  );
};

export default LocationHero;
