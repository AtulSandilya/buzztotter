import * as React from "react";
import { Component, PropTypes } from 'react';
import { Image, Linking, ListView, Text, TouchableHighlight, View } from 'react-native';

import MapView from 'react-native-maps';

import {isAndroid, isIOS} from '../Utilities';

import {Location} from '../reducers/locations';

import TitleText from './TitleText';
import BevButton from './BevButton';

import {globalColors, globalStyles} from './GlobalStyles';

const openMapsToAddress = (latitude, longitude, name) => {
  let url;
  // encodeURIComponent properly converts characters into url format.
  if(isAndroid){
    url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`;
  } else if (isIOS){
    url = `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(name)}`;
  }

  Linking.canOpenURL(url).then(supported => {
    if(supported){
      Linking.openURL(url);
    } else {
      alert("External maps not supported!");
    }
  })
}

export interface BevegramLocationsProps {
  markers?: [Location];
  numRenders?: number;
  tabLabel?: string;
}

interface BevegramLocationsState {
  renders: number;
}

export default class BevegramLocations extends Component<BevegramLocationsProps, BevegramLocationsState> {
  constructor(props){
    super(props);
    this.state = {
      renders: 0,
    }
  }

  render() {
    const locationDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    if(this.state.renders > 1) {
      return(
        <View></View>
      )
    }

    this.state.renders += 1;
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
              <View style={{flex: 1, alignItems: 'center'}}>
                <View style={{flex: -1, padding: 10, backgroundColor: globalColors.bevPrimary, borderRadius: 3, flexDirection: 'row', borderWidth: 1, borderColor: '#000000'}}>
                  <View style={{paddingLeft: 10, flex: -1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{markerData.name}</Text>
                    <Text>{markerData.typicalHours}</Text>
                  </View>
                </View>
                <View style={{
                  flex: -1,
                  alignSelf: 'center',
                  width: 0,
                  height: 0,
                  backgroundColor: 'transparent',
                  borderStyle: 'solid',
                  borderLeftWidth: 10,
                  borderRightWidth: 10,
                  borderTopWidth: 15,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: globalColors.bevPrimary,
                  zIndex: 10,
                  top: -1,
                }}>
                </View>
                <View style={{
                  position: 'relative',
                  top: -15,
                  flex: -1,
                  alignSelf: 'center',
                  width: 0,
                  height: 0,
                  backgroundColor: 'transparent',
                  borderStyle: 'solid',
                  borderLeftWidth: 11,
                  borderRightWidth: 11,
                  borderTopWidth: 16,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: "#000000",
                  zIndex: 5,
                }}>
                </View>
              </View>
            </MapView.Marker>
            )
          })}
        </MapView>
        <View style={{flex: 4}}>
          <ListView
            dataSource={locationDS.cloneWithRows(this.props.markers)}
            renderHeader={() => (
              <View style={{margin: 10, marginBottom: 0, borderBottomWidth: 1, borderBottomColor: globalColors.subtleSeparator}}>
                <Text style={globalStyles.titleText}>Buzz Otter Bars:</Text>
              </View>
            )}
            renderRow={(rowData) =>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10}}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>{rowData.name}</Text>
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
          />
        </View>
      </View>
    );
  }
}
