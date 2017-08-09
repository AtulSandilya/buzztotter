import * as React from "react";
import { Component } from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";

import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/Ionicons";

import { isIOS, StatusBarHeight } from "../ReactNativeUtilities";

import { BannerProps } from "../reducers/banner";
import Banner from "./Banner";

import { globalColors } from "./GlobalStyles";

export const BrandingHeight = (isIOS ? 75 : 75) + 10;
export const BrandingZIndex = 100;
export const NavBarHeight = BrandingHeight;
// Respect the StatusBar
const topMargin = StatusBarHeight;
const verticalPadding = 5;
const logoHeight = BrandingHeight - topMargin - verticalPadding * 2;
const contentHeight = BrandingHeight - StatusBarHeight;

const textSizeMultiplier = 0.35;

interface Style {
  wrapper: ViewStyle;
  content: ViewStyle;
  section: ViewStyle;
  leftContainer: ViewStyle;
  centerContainer: ViewStyle;
  rightContainer: ViewStyle;
  icon: TextStyle;
  text: TextStyle;
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
    zIndex: BrandingZIndex,
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
    zIndex: BrandingZIndex,
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
  rightAction?: () => void;
  backText?: string;
  navBarText?: string;
  showSettings?: boolean;
  bannerProps?: BannerProps;
  goToSettings?(): void;
  goBackRoute?(): void;
  onHideBanner?(): void;
}

const Branding: React.StatelessComponent<BrandingProps> = ({
  showLogo = false,
  showBack = false,
  showSettings = false,
  backText = "",
  bannerProps,
  navBarText = "",
  goToSettings,
  goBackRoute,
  onHideBanner,
}) => {
  const centerText = navBarText;
  const hitSlop = 20;
  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <View style={[styles.section, styles.leftContainer]}>
          {showLogo ? <Logo /> : null}
          {showBack
            ? <TouchableHighlight
                underlayColor={"transparent"}
                hitSlop={{
                  bottom: hitSlop,
                  left: hitSlop,
                  right: hitSlop,
                  top: hitSlop,
                }}
                style={{
                  flex: -1,
                }}
                onPress={() => {
                  // Close the keyboard if it is open, otherwise go back a
                  // route. This assumes that the keyboard is open if there is a
                  // text field in focus, this is the simplest way to detect if
                  // the keyboard is open.
                  let shouldDismissKeyboard;
                  try {
                    shouldDismissKeyboard = TextInput.State.currentlyFocusedField();
                  } catch (e) {
                    // pass
                  }

                  if (shouldDismissKeyboard) {
                    Keyboard.dismiss();
                    goBackRoute();
                  } else {
                    goBackRoute();
                  }
                }}
              >
                <View style={{ flex: -1, flexDirection: "row" }}>
                  <Icon
                    name={(isIOS ? "ios" : "md") + "-arrow-back"}
                    size={logoHeight * 0.9}
                    style={styles.icon}
                  />
                  {/* Only show back text if there is no center text */}
                  {centerText.length !== 0
                    ? <Text style={styles.text}>
                        {backText}
                      </Text>
                    : null}
                </View>
              </TouchableHighlight>
            : null}
        </View>
        <View
          style={[
            styles.section,
            styles.centerContainer,
            {
              alignItems: "center",
              justifyContent: "center",
            },
            centerText.length > 0 ? { flex: 3 } : null,
          ]}
        >
          <Text
            style={[
              styles.text,
              {
                alignSelf: "center",
                overflow: "visible",
              },
            ]}
            numberOfLines={1}
          >
            {centerText}
          </Text>
        </View>
        <View style={[styles.section, styles.rightContainer]}>
          {showSettings
            ? <TouchableHighlight
                underlayColor={"transparent"}
                onPress={goToSettings}
              >
                <Icon
                  name={(isIOS ? "ios" : "md") + "-settings"}
                  size={logoHeight * 0.9}
                  style={styles.icon}
                />
              </TouchableHighlight>
            : null}
        </View>
      </View>
      <Banner onHide={onHideBanner} {...bannerProps} />
    </View>
  );
};

class Logo extends Component<{}, {}> {
  public static logoAnimationDuration = 500;
  public render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          const refs = this.refs as any;
          refs.logo.rotate(Logo.logoAnimationDuration);
        }}
      >
        <Animatable.Image
          ref="logo"
          easing="ease-in"
          source={require("../../img/logos/logo-on-brown.png")}
          style={{
            flex: -1,
            height: 55,
            width: 95,
          }}
          resizeMode="contain"
          resizeMethod="scale"
        />
      </TouchableWithoutFeedback>
    );
  }
}

export default Branding;
