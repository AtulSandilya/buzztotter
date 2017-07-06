import * as React from "react";
import { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  ListView,
  RefreshControl,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

import MapView from "react-native-maps";

import { ParseIntAsDecimal, PrettyFormatDistance } from "../CommonUtilities";
import { GpsCoordinates, Location } from "../db/tables";
import { FormatDayHours } from "./LocationDetail";

import BevPressableLine from "./BevPressableLine";
import BevUiText from "./BevUiText";

import { globalColors, globalStyles } from "./GlobalStyles";

export interface BevegramLocationsProps {
  markers?: Location[];
  numRenders?: number;
  tabLabel?: string;
  isReloading?: boolean;
  locationFetchingAllowed?: boolean;
  userCoords?: GpsCoordinates;
  getNearestLocations?(): void;
  toggleLocationSetting?(): void;
  goToLocationDetail?(loc: Location): void;
}

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface BevegramLocationState {
  region: MapRegion;
  delta: {
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export default class BevegramLocations extends Component<
  BevegramLocationsProps,
  BevegramLocationState
> {
  constructor(props) {
    super(props);
    this.state = {
      delta: undefined,
      region: undefined,
    };
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  /* tslint:disable:member-ordering */
  private onRegionChange(region) {
    this.setState(prevState => {
      return {
        ...prevState,
        // If region is undefined we want to change the center of the map but
        // keep the zoom level thus we clear the region but not the delta
        delta: region
          ? {
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            }
          : prevState.delta,
        region,
      };
    });
  }

  /* tslint:disable:object-literal-sort-keys */
  public render() {
    const locationDS = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    // `react-native-maps` renders the markers in order meaning the last
    // marker is above the first marker. Reversing the markers renders the
    // first location on top
    const reversedMarkers = this.props.markers.slice().reverse();

    const overrideProps = {
      refreshControl: null,
    };

    const todayAsNumber = new Date().getDay();

    // Central Denver
    const defaultCoords: GpsCoordinates = {
      latitude: 39.7392358,
      longitude: -104.990251,
    };

    const mapCenterCoords: GpsCoordinates = this.props.userCoords
      ? this.props.userCoords
      : defaultCoords;

    // How zoomed in/out the map is
    const defaultDelta = {
      latitudeDelta: 0.0922 * 1.75,
      longitudeDelta: 0.0421 * 1.75,
    };

    const mapDelta = this.state.delta ? this.state.delta : defaultDelta;

    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 6 }}
          region={
            this.state.region
              ? this.state.region
              : { ...mapCenterCoords, ...mapDelta }
          }
          onRegionChange={region => this.onRegionChange(region)}
        >
          {reversedMarkers.map((markerData, index) => {
            const numMarkers = this.props.markers.length;
            return (
              <MapView.Marker
                key={index}
                style={{ top: -15 }}
                coordinate={{
                  latitude: markerData.latitude,
                  longitude: markerData.longitude,
                }}
              >
                <View style={{ flex: -1, alignItems: "center", maxWidth: 185 }}>
                  <View
                    style={{
                      flex: -1,
                      padding: 6,
                      backgroundColor: globalColors.bevPrimary,
                      borderRadius: 3,
                      flexDirection: "row",
                      borderWidth: 1,
                      borderColor: "#000000",
                    }}
                  >
                    <View
                      style={{
                        paddingLeft: 10,
                        flex: -1,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        {numMarkers - index}. {markerData.name}
                      </Text>
                      <BevUiText icon="clock-o" color="#000000">
                        {
                          markerData.typicalHours[todayAsNumber]
                            .split(": ")
                            .slice(-1)[0]
                        }
                      </BevUiText>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: -1,
                      alignSelf: "center",
                      width: 0,
                      height: 0,
                      backgroundColor: "transparent",
                      borderStyle: "solid",
                      borderLeftWidth: 10,
                      borderRightWidth: 10,
                      borderTopWidth: 15,
                      borderLeftColor: "transparent",
                      borderRightColor: "transparent",
                      borderTopColor: globalColors.bevPrimary,
                      zIndex: 10,
                      top: -1,
                    }}
                  />
                  <View
                    style={{
                      position: "relative",
                      top: -15,
                      flex: -1,
                      alignSelf: "center",
                      width: 0,
                      height: 0,
                      backgroundColor: "transparent",
                      borderStyle: "solid",
                      borderLeftWidth: 11,
                      borderRightWidth: 11,
                      borderTopWidth: 16,
                      borderLeftColor: "transparent",
                      borderRightColor: "transparent",
                      borderTopColor: "#000000",
                      zIndex: 5,
                    }}
                  />
                </View>
              </MapView.Marker>
            );
          })}
        </MapView>
        <View style={{ flex: 4 }}>
          <ListView
            dataSource={locationDS.cloneWithRows(this.props.markers)}
            renderHeader={() =>
              <TouchableHighlight
                underlayColor={"#ffffff"}
                onPress={() => {
                  if (this.props.locationFetchingAllowed) {
                    this.onRegionChange(undefined);
                    this.props.getNearestLocations();
                  } else {
                    Alert.alert(
                      "Location Refresh Error",
                      "Location fetching is disabled!\nEnable location services?",
                      [
                        { text: "No" },
                        {
                          text: "One Time",
                          onPress: () => {
                            this.props.getNearestLocations();
                          },
                        },
                        {
                          text: "Yes",
                          onPress: () => {
                            this.onRegionChange(undefined);
                            this.props.getNearestLocations();
                            this.props.toggleLocationSetting();
                          },
                        },
                      ],
                    );
                  }
                }}
                style={{
                  borderBottomColor: globalColors.subtleSeparator,
                  borderBottomWidth: 1,
                  flex: 1,
                  margin: 6,
                  marginBottom: 0,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View style={{ flex: -1 }}>
                    <Text
                      style={[
                        globalStyles.titleText,
                        { flex: -1, alignSelf: "flex-start" },
                      ]}
                    >
                      Buzz Otter Bars
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "flex-end",
                      justifyContent: "center",
                      paddingRight: 8,
                    }}
                  >
                    {this.props.isReloading
                      ? <View style={{ flexDirection: "row" }}>
                          <ActivityIndicator style={{ paddingRight: 8 }} />
                          <BevUiText>
                            Refreshing
                          </BevUiText>
                        </View>
                      : <BevUiText icon="refresh" iconSize="large">
                          Refresh
                        </BevUiText>}
                  </View>
                </View>
              </TouchableHighlight>}
            renderRow={(rowData, sectionId, rowId) =>
              <BevPressableLine
                onPress={() => this.props.goToLocationDetail(rowData)}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {ParseIntAsDecimal(rowId as string) + 1}. {rowData.name}
                </Text>
                <BevUiText icon="map-marker" style={{ marginTop: 3 }}>
                  {rowData.distanceFromUser
                    ? PrettyFormatDistance(
                        rowData.distanceFromUser,
                        "imperial",
                        rowData.squareFootage,
                      )
                    : ""}
                </BevUiText>
                <BevUiText icon="clock-o" style={{ paddingTop: 5 }}>
                  {FormatDayHours(rowData.typicalHours[todayAsNumber])}
                </BevUiText>
              </BevPressableLine>}
            renderSeparator={(sectionId, rowId) =>
              <View key={rowId} style={globalStyles.listRowSeparator} />}
            refreshControl={
              <RefreshControl
                refreshing={this.props.isReloading}
                onRefresh={() => {
                  if (!this.props.isReloading) {
                    this.props.getNearestLocations();
                  }
                }}
                title="Updating..."
                tintColor={globalColors.bevPrimary}
                progressViewOffset={50}
                colors={[globalColors.bevPrimary]}
              />
            }
            {...overrideProps}
          />
        </View>
      </View>
    );
  }
}
