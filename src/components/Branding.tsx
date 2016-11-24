import * as React from "react";
import { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';

import {isAndroid, isIOS, StatusBarHeight} from '../Utilities';

import CenteredModal from './CenteredModal';
import CSettings from '../containers/CSettings';

import {globalColors, globalStyles} from './GlobalStyles';

export interface BrandingProps {
  goToSettings?(): void;
}

export const BrandingHeight = (isIOS ? 75 : 75) + 10;

const Branding: React.StatelessComponent<BrandingProps> = ({goToSettings}) => {
  const navBarHeight = BrandingHeight;
  // Respect the StatusBar
  // const topPadding = isIOS ? 20 : (isAndroid ? 20 : 0);
  const topPadding = StatusBarHeight;
  const topMargin = 5;
  const bottomMargin = 5;
  const logoHeight = navBarHeight - topPadding - topMargin - bottomMargin;
  return (
    <View style={{
      height: navBarHeight,
      backgroundColor: globalColors.statusBarBackground,
      position: 'absolute',
      left: 0,
      top: 0,
      width: Dimensions.get("window").width,
      paddingTop: topPadding,
      flexDirection: 'row',
    }}>
      <View style={{
        height: navBarHeight - topPadding,
        paddingTop: topMargin,
        paddingBottom: bottomMargin,
        flex: 1,
        paddingLeft: 10,
        alignItems: 'flex-start',
        backgroundColor: globalColors.bevPrimary,
      }}>
        <Image
          source={require('../../img/logos/logo-on-brown.png')}
          style={{
            flex: -1,
            height: 55,
            width: 95,
          }}
          resizeMode='contain'
          resizeMethod='scale'
        />
      </View>
      <View style={{
        height: navBarHeight - topPadding,
        paddingTop: topMargin,
        paddingBottom: bottomMargin,
        flex: 1,
        paddingRight: 10,
        alignItems: 'flex-end',
        backgroundColor: globalColors.bevPrimary,
      }}>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
          onPress={goToSettings}
        >
          <Icon
            name={(isIOS ? "ios" : "md") + "-settings"}
            size={logoHeight * 0.9}
            style={{
              paddingTop: 3,
              color: "#ffffff",
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Branding;
