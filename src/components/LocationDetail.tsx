import * as React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

import MapView from "react-native-maps";

import { PrettyFormatDistance } from "../CommonUtilities";
import { Location, LocationViewport } from "../db/tables";
import { isAndroid, isIOS } from "../ReactNativeUtilities";
import { globalColors, globalStyles } from "./GlobalStyles";

import BevPressableLine from "./BevPressableLine";
import BevUiText from "./BevUiText";
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

const OpenMapsAppToAddress = (latitude, longitude, name) => {
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
      <View style={{ flex: 1, padding: 15 }}>
        <Text style={globalStyles.heroText}>{loc.name}</Text>
        <TouchableHighlight
          onPress={() =>
            OpenMapsAppToAddress(loc.latitude, loc.longitude, loc.name)}
          underlayColor="#ffffff"
        >
          <View>
            <BevUiText icon={"globe"} style={{ paddingBottom: 4 }}>
              {loc.address}
            </BevUiText>
          </View>
        </TouchableHighlight>
        <BevUiText icon="map-marker">
          {loc.distanceFromUser
            ? PrettyFormatDistance(
                loc.distanceFromUser,
                "imperial",
                loc.squareFootage,
              )
            : ""}
        </BevUiText>
        <View
          style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: globalColors.subtleSeparator,
            borderTopWidth: StyleSheet.hairlineWidth,
            flex: -1,
            flexDirection: "row",
            marginTop: 10,
            paddingVertical: 10,
          }}
        >
          <View style={{ flex: -1, paddingRight: 15 }}>
            <Text style={[globalStyles.sectionStartText, { paddingBottom: 8 }]}>
              Typical Hours:
            </Text>
            {loc.typicalHours.map((dayHours, index) => {
              const isToday = index === new Date().getDay();
              return (
                <BevUiText
                  icon={isToday ? "chevron-right" : "clock-o"}
                  key={dayHours}
                  fontSize="large"
                  style={{ paddingBottom: 8 }}
                  iconBold={isToday}
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
          <BevUiText icon="map" fontSize="large" morePaddingAfterIcon={true}>
            Show in Maps App
          </BevUiText>
        </BevPressableLine>
        <BevPressableLine onPress={() => CallPhoneNumber(loc.phoneNumber)}>
          <BevUiText icon="phone" fontSize="large" morePaddingAfterIcon={true}>
            {`Call`}
          </BevUiText>
        </BevPressableLine>
        <BevPressableLine
          onPress={() =>
            OpenLink(loc.url, `Cannot open the website for ${loc.name}!`)}
        >
          <BevUiText icon="link" fontSize="large" morePaddingAfterIcon={true}>
            Go To Website
          </BevUiText>
        </BevPressableLine>
      </View>
    </RouteWithNavBarWrapper>
  );
};

export default LocationDetail;
