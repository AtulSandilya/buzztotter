import * as React from "react";
import { Component } from "react";
import { ActivityIndicator, Image, Linking, ListView, RefreshControl, Text, TouchableHighlight, View } from "react-native";

import MapView from "react-native-maps";

import {isAndroid, isIOS} from "../ReactNativeUtilities";

import {Location} from "../db/tables";

import BevButton from "./BevButton";
import TitleText from "./TitleText";

import {globalColors, globalStyles} from "./GlobalStyles";

const openMapsToAddress = (latitude, longitude, name) => {
  let url;
  // encodeURIComponent properly converts characters into url format.
  if (isAndroid){
    url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`;
  } else if (isIOS){
    url = `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(name)}`;
  }

  Linking.canOpenURL(url).then((supported) => {
    if (supported){
      Linking.openURL(url);
    } else {
      alert("External maps not supported!");
    }
  });
};

export interface BevegramLocationsProps {
  markers?: [Location];
  numRenders?: number;
  tabLabel?: string;
  isReloading?: boolean;
  getNearestLocations?(): void;
}

export default class BevegramLocations extends Component<BevegramLocationsProps, {}> {
  render() {
    const locationDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    return(
      <View style={{flex: 1}}>
        <MapView
            style={{flex: 6}}
            initialRegion={{
              latitude: 39.7392358,
              longitude: -104.990251,
              latitudeDelta: 0.0922 * 1.75,
              longitudeDelta: 0.0421 * 1.75,
            }}
          >
          {this.props.markers.map((markerData, id) => {
            return (
              <MapView.Marker
                key={id}
                style={{top: -15}}
                coordinate={{
                  latitude: markerData.latitude,
                  longitude: markerData.longitude,
                }}
              >
              <View style={{flex: 1, alignItems: "center"}}>
                <View style={{flex: -1, padding: 10, backgroundColor: globalColors.bevPrimary, borderRadius: 3, flexDirection: "row", borderWidth: 1, borderColor: "#000000"}}>
                  <View style={{paddingLeft: 10, flex: -1, alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                    <Text style={{fontSize: 18, fontWeight: "bold"}}>{markerData.name}</Text>
                    <Text>{markerData.typicalHours}</Text>
                  </View>
                </View>
                <View style={{
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
                }}>
                </View>
                <View style={{
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
                }}>
                </View>
              </View>
            </MapView.Marker>
            );
          })}
        </MapView>
        <View style={{flex: 4}}>
          <ListView
            dataSource={locationDS.cloneWithRows(this.props.markers)}
            renderHeader={() => (
              <TouchableHighlight
                underlayColor={"#ffffff"}
                onPress={() => {
                  this.props.getNearestLocations();
                }}
                style={{
                  borderBottomColor: globalColors.subtleSeparator,
                  borderBottomWidth: 1,
                  flex: 1,
                  margin: 10,
                  marginBottom: 0,
                }}>
                  <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
                    <Text style={globalStyles.titleText}>Buzz Otter Bars:</Text>
                    {this.props.isReloading ?
                      <ActivityIndicator />
                    : <View/>}
                  </View>
              </TouchableHighlight>
            )}
            renderRow={(rowData) =>
              <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10}}>
                <View style={{flex: 1, flexDirection: "column"}}>
                  <Text style={{fontSize: 20, fontWeight: "bold"}}>{rowData.name}</Text>
                  <Text style={{fontSize: 20}}>{rowData.typicalHours}</Text>
                </View>
                <View style={{flex: 1}}>
                  <BevButton
                    text={"Open in Maps"}
                    shortText="Map"
                    label="Open Map Button"
                    buttonFontSize={16}
                    rightIcon={true}
                    onPress={() => openMapsToAddress(rowData.latitude, rowData.longitude, rowData.name)}
                  />
                </View>
              </View>
            }
            renderSeparator={(sectionId, rowId) =>
              <View
                key={rowId}
                style={globalStyles.listRowSeparator}
              />
            }
          refreshControl={
            <RefreshControl
              refreshing={this.props.isReloading}
              onRefresh={() => {
                if(!this.props.isReloading){
                  this.props.getNearestLocations();
                }
              }}
              title="Updating..."
              tintColor={globalColors.bevPrimary}
              progressViewOffset={50}
              colors={[globalColors.bevPrimary]}
            />
          }
          />
        </View>
      </View>
    );
  }
}
