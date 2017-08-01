import * as React from "react";
import { Text, TouchableHighlight, View } from "react-native";

import { PrettyFormatDistance } from "../CommonUtilities";
import { Location } from "../db/tables";

import BevUiText from "./BevUiText";
import { globalStyles } from "./GlobalStyles";
import { OpenMapsAppToAddress } from "./LocationDetail";

interface LocationHeroProps {
  loc: Location;
}

const LocationHero: React.StatelessComponent<LocationHeroProps> = props => {
  return (
    <View>
      <Text style={globalStyles.heroText}>{props.loc.name}</Text>
      <TouchableHighlight
        onPress={() =>
          OpenMapsAppToAddress(
            props.loc.latitude,
            props.loc.longitude,
            props.loc.name,
          )}
        underlayColor="#ffffff"
      >
        <View>
          <BevUiText icon={"globe"} style={{ paddingBottom: 4 }}>
            {props.loc.address}
          </BevUiText>
        </View>
      </TouchableHighlight>
      <BevUiText icon="map-marker">
        {PrettyFormatDistance(
          props.loc.distanceFromUser,
          "imperial",
          props.loc.squareFootage,
        )}
      </BevUiText>
    </View>
  );
};

export default LocationHero;
