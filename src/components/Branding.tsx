import * as React from "react";
import { Component, PropTypes } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

import {connect} from "react-redux";

import Icon from "react-native-vector-icons/Ionicons";

import {isAndroid, isIOS, StatusBarHeight} from "../Utilities";

import CSettings from "../containers/CSettings";
import CenteredModal from "./CenteredModal";

import {globalColors, globalStyles} from "./GlobalStyles";

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
    backgroundColor: globalColors.bevPrimary,
    flexDirection: "row",
    height: BrandingHeight,
    left: 0,
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
  },
  section: {
    flex: 1,
  },
  content: {
    backgroundColor: globalColors.bevPrimary,
    flex: 1,
    flexDirection: "row",
    height: contentHeight,
    marginTop: StatusBarHeight,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: verticalPadding,
  },
  leftContainer: {
    alignItems: "flex-start",
  },
  centerContainer: {
    overflow: "visible",
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  icon: {
    alignSelf: "center",
    color: "#ffffff",
    paddingTop: 3,
  },
  text: {
    alignSelf: "center",
    color: "#ffffff",
    fontSize: logoHeight * textSizeMultiplier,
  },
});

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
              source={require("../../img/logos/logo-on-brown.png")}
              style={{
                flex: -1,
                height: 55,
                width: 95,
              }}
              resizeMode="contain"
              resizeMethod="scale"
            />
          :
            null
          }
          { showBack ?
            <TouchableHighlight
              underlayColor={"transparent"}
              style={{
                flex: -1,
              }}
              onPress={() => {
                // Close the keyboard if it is open, otherwise go back a
                // route. This assumes that the keyboard is open if there is a
                // text field in focus, this is the simplest way to detect if
                // the keyboard is open.
                if (TextInput.State.currentlyFocusedField()) {
                  Keyboard.dismiss();
                } else {
                  goBackRoute();
                }
              }}
            >
              <View style={{flex: -1, flexDirection: "row"}}>
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
            alignItems: "center",
            justifyContent: "center",
          }, centerText.length > 0 ? {flex: 3} : null]}>
          <Text
            style={[styles.text, {
              alignSelf: "center",
              overflow: "visible",
            }]}
            numberOfLines={1}
          >
            {centerText}
          </Text>
        </View>
        <View style={[styles.section, styles.rightContainer]}>
          {showSettings ?
            <TouchableHighlight
              underlayColor={"transparent"}
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
  );
};

export default Branding;
