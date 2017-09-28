import * as React from "react";
import { Linking, StyleSheet, View } from "react-native";

import MapView from "react-native-maps";

import { PrettyFormatAddress } from "../CommonUtilities";
import { Location, LocationViewport } from "../db/tables";
import { isAndroid, isIOS } from "../ReactNativeUtilities";
import theme from "../theme";
import { globalColors } from "./GlobalStyles";

import BevPressableLine from "./BevPressableLine";
import BevText from "./BevText";
import BevUiText from "./BevUiText";
import LocationHero from "./LocationHero";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";

export interface LocationDetailProps {
  loc: Location;
}

const OpenLink = (link: string, errorMessage: string) => {
  Linking.canOpenURL(link).then(supported => {
    if (supported) {
      Linking.openURL(link);
    } else {
      alert(errorMessage);
    }
  });
};

export const OpenMapsAppToAddress = (latitude, longitude, name) => {
  let url;
  // encodeURIComponent properly converts characters into url format.
  if (isAndroid) {
    url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(
      name,
    )})`;
  } else if (isIOS) {
    url = `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(
      name,
    )}`;
  }
  OpenLink(url, "External maps not supported!");
};

const CallPhoneNumber = (phoneNumber: string) => {
  const url = `tel:${encodeURIComponent(phoneNumber)}`;
  OpenLink(url, "Phone calls not supported!");
};

export const FormatDayHours = (dayHour: string): string => {
  const dayChars = 3;
  const day = dayHour.split(" ")[0].slice(0, dayChars);
  const hours = dayHour.split(" ").slice(1).join(" ").replace(/:00/g, "");
  return `${day}: ${hours}`;
};

const CalcDeltaFromViewport = (
  viewport: LocationViewport,
): { latitudeDelta: number; longitudeDelta: number } => {
  return {
    latitudeDelta: viewport.northeast.latitude - viewport.southwest.latitude,
    longitudeDelta: viewport.northeast.longitude - viewport.southwest.longitude,
  };
};

/* tslint:disable:jsx-no-lambda */
const LocationDetail: React.StatelessComponent<LocationDetailProps> = props => {
  const loc: Location = props.loc;
  return (
    <RouteWithNavBarWrapper>
      <View style={{ flex: 1, padding: 14 }}>
        <LocationHero loc={props.loc} />
        <View
          style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: globalColors.subtleSeparator,
            borderTopWidth: StyleSheet.hairlineWidth,
            flex: -1,
            flexDirection: "row",
            marginTop: theme.margin.normal,
            paddingVertical: theme.padding.normal,
          }}
        >
          <View style={{ flex: -1, paddingRight: 15 }}>
            <BevText textStyle={{ paddingBottom: theme.padding.small }}>
              Typical Hours:
            </BevText>
            {loc.typicalHours.map((dayHours, index) => {
              const isToday = index === new Date().getDay();
              return (
                <BevUiText
                  icon={isToday ? "rightArrow" : "businessHours"}
                  key={dayHours}
                  style={{ paddingBottom: 8 }}
                  iconWidth={theme.font.size.large}
                >
                  {FormatDayHours(dayHours)}
                </BevUiText>
              );
            })}
          </View>
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: loc.latitude,
              longitude: loc.longitude,
              ...CalcDeltaFromViewport(loc.viewport),
            }}
          >
            <MapView.Marker
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
            />
          </MapView>
        </View>
        <BevPressableLine
          onPress={() =>
            OpenMapsAppToAddress(loc.latitude, loc.longitude, loc.name)}
        >
          <BevUiText icon="map" hero={true} morePaddingAfterIcon={true}>
            {`${PrettyFormatAddress(loc.address)}`}
          </BevUiText>
        </BevPressableLine>
        <BevPressableLine onPress={() => CallPhoneNumber(loc.phoneNumber)}>
          <BevUiText icon="phone" hero={true} morePaddingAfterIcon={true}>
            {`${loc.phoneNumber}`}
          </BevUiText>
        </BevPressableLine>
        <BevPressableLine
          onPress={() =>
            OpenLink(loc.url, `Cannot open the website "${loc.url}"!`)}
        >
          <BevUiText icon="link" hero={true} morePaddingAfterIcon={true}>
            {`${loc.url}`}
          </BevUiText>
        </BevPressableLine>
      </View>
    </RouteWithNavBarWrapper>
  );
};

export default LocationDetail;
