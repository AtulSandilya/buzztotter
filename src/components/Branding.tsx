import * as React from "react";
import { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';

import {isAndroid, isIOS, StatusBarHeight} from '../Utilities';

import CenteredModal from './CenteredModal';
import CSettings from '../containers/CSettings';

import {globalColors, globalStyles} from './GlobalStyles';

export const BrandingHeight = (isIOS ? 75 : 75) + 10;
export const NavBarHeight = BrandingHeight;
// Respect the StatusBar
const topMargin = StatusBarHeight;
const verticalPadding = 5;
const logoHeight = BrandingHeight - topMargin - (verticalPadding * 2);
const contentHeight = BrandingHeight - StatusBarHeight;

const textSizeMultiplier = 0.35;

interface Style {
  wrapper: React.ViewStyle;
  content: React.ViewStyle;
  section: React.ViewStyle;
  leftContainer: React.ViewStyle;
  centerContainer: React.ViewStyle;
  rightContainer: React.ViewStyle;
  icon: React.TextStyle;
  text: React.TextStyle;
}

const styles = StyleSheet.create<Style>({
  wrapper: {
    height: BrandingHeight,
    backgroundColor: globalColors.bevPrimary,
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get("window").width,
    flexDirection: 'row',
  },
  section: {
    flex: 1,
  },
  content: {
    flex: 1,
    height: contentHeight,
    marginTop: StatusBarHeight,
    overflow: 'hidden',
    paddingVertical: verticalPadding,
    paddingHorizontal: 10,
    backgroundColor: globalColors.bevPrimary,
    flexDirection: 'row',
  },
  leftContainer: {
    alignItems: 'flex-start',
  },
  centerContainer: {
    overflow: 'visible',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  icon: {
    paddingTop: 3,
    color: "#ffffff",
    alignSelf: 'center',
  },
  text: {
    fontSize: logoHeight * textSizeMultiplier,
    color: "#ffffff",
    alignSelf: 'center',
  }
})

export interface BrandingProps {
  showLogo?: boolean;
  showBack?: boolean;
  rightIcon?: boolean;
  rightAction?: Function;
  backText?: string;
  navBarText?: string;
  showSettings?: boolean;
  goToSettings?(): void;
  goBackRoute?(): void;
}

const Branding: React.StatelessComponent<BrandingProps> = ({
  showLogo = false,
  showBack = false,
  showSettings = false,
  backText = "",
  navBarText = "",
  goToSettings,
  goBackRoute,
}) => {
  const centerText = navBarText;
  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <View style={[styles.section, styles.leftContainer]}>
          {showLogo ?
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
          :
            null
          }
          { showBack ?
            <TouchableHighlight
              style={{
                flex: -1,
              }}
              onPress={() => {
                goBackRoute();
              }}
            >
              <View style={{flex: -1, flexDirection: 'row'}}>
                <Icon
                  name={(isIOS ? "ios" : "md") + "-arrow-back"}
                  size={logoHeight * 0.9}
                  style={styles.icon}
                />
                {/* Only show back text if there is no center text */}
                {centerText.length !== 0 ?
                  <Text style={styles.text}>
                    {backText}
                  </Text>
                :
                  null
                }
              </View>
            </TouchableHighlight>
          :
            null
          }
        </View>
        <View style={[
          styles.section,
          styles.centerContainer,
          {
            justifyContent: 'center',
            alignItems: 'center',
          }, centerText.length > 0 ? {flex: 3} : null]}>
          <Text
            style={[styles.text, {
              alignSelf: 'center',
              overflow: 'visible',
            }]}
            numberOfLines={1}
          >
            {centerText}
          </Text>
        </View>
        <View style={[styles.section, styles.rightContainer]}>
          {showSettings ?
            <TouchableHighlight
              onPress={goToSettings}
            >
              <Icon
                name={(isIOS ? "ios" : "md") + "-settings"}
                size={logoHeight * 0.9}
                style={styles.icon}
              />
            </TouchableHighlight>
          :
            null
          }
        </View>
      </View>
    </View>
  )
}

export default Branding;
