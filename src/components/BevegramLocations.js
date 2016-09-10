import React, { Component, PropTypes } from 'react';
import { Image, Linking, ListView, Text, TouchableHighlight, View } from 'react-native';

import MapView from 'react-native-maps';

import TitleText from '../TitleText'
import BevButton from '../BevButton'

import {colors, styles} from '../Styles'
import {globalStyles} from '../Global'

const openMapsToAddress = (latitude, longitude, name) => {
  // Both Maps apps like properly encoded strings
  let url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`;
  Linking.canOpenURL(url).then(supported => {
    console.log(url);
    if(supported){
      Linking.openURL(url);
    } else {
      alert("External maps not supported!");
    }
  })
}

export const BevegramLocations = ({markers}) => {
  const locationDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
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
          {markers.map((markerData, id) => {
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
                <View style={{flex: -1, padding: 10, backgroundColor: colors.bevPrimary, borderRadius: 3, flexDirection: 'row', borderWidth: 1, borderColor: '#000000'}}>
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
                  borderTopColor: colors.bevPrimary,
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
          <View style={{margin: 10, marginBottom: 0, borderBottomWidth: 1, borderBottomColor: colors.subtleSeparator}}>
            <Text style={styles.titleText}>Bevegram Accepted At:</Text>
          </View>
          <ListView
            dataSource={locationDS.cloneWithRows(markers)}
            renderRow={(rowData) =>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>{rowData.name}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={{fontSize: 20}}>{rowData.typicalHours}</Text>
                </View>
                <View style={{flex: 1}}>
                  <BevButton
                    buttonText={"Open in Maps"}
                    buttonFontSize={16}
                    bevButtonPressed={() => openMapsToAddress(rowData.latitude, rowData.longitude, rowData.name)}
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
