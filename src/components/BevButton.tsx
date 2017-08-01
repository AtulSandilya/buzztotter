import * as React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";

import { isAndroid, isNarrow } from "../ReactNativeUtilities";
import { globalColors } from "./GlobalStyles";

interface Style {
  button: ViewStyle;
  greenButton: ViewStyle;
  buttonContainer: ViewStyle;
  buttonText: TextStyle;
  greenButtonText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  button: {
    alignItems: "center",
    backgroundColor: globalColors.bevSecondary,
    borderColor: "#000000",
    borderRadius: 10,
    elevation: 5,
    flex: -1,
    flexDirection: "row",
    justifyContent: "center",
    margin: 15,
    padding: 15,
    shadowColor: "#333333",
    shadowOffset: {
      height: 1,
      width: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 0.95,
  },
  buttonContainer: {
    flex: -1,
    flexDirection: "row-reverse",
  },
  buttonText: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: "#ffffff",
  },
  greenButton: {
    backgroundColor: globalColors.bevPrimary,
  },
  greenButtonText: {
    color: "#333333",
  },
});

// A button should be at least 44dp tall, and taller if the font size is
// larger than the default 12
export const getButtonHeight = (buttonFontSize = 12) => {
  const buttonHeight = 44 + (buttonFontSize - 12);

  return buttonHeight > 44 ? buttonHeight : 44;
};

const BevButton = ({
  text,
  shortText,
  // Accessibility label and test label (Espresso accesses this with
  // "withContentDescription" )
  label,
  buttonFontSize = 12,
  onPress,
  rightIcon = false,
  margin = 12,
  showSpinner = false,
  showDisabled = false,
  isGreen = false,
  // In a row with two buttons if one has an icon it will be taller than the
  // button without the icon, this prop makes the icon button shorter, trying
  // to match the height of the adjacentButton
  leftIcon = "",
  fontAwesomeLeftIcon = "",
  style = {},
}) => {
  const useShortText = isNarrow;
  const iconStyle = isAndroid
    ? {
        fontSize: buttonFontSize * 2,
        paddingVertical: 0,
      }
    : {
        fontSize: buttonFontSize * 2,
        paddingTop: 2,
      };
  const smallIconStyle = isAndroid
    ? {
        fontSize: buttonFontSize * 1.5,
      }
    : {
        fontSize: buttonFontSize * 1.5,
        paddingTop: 2,
      };

  const buttonHeight = getButtonHeight(buttonFontSize);

  const buttonStyle = StyleSheet.flatten([
    styles.button,
    style,
    isGreen ? styles.greenButton : {},
  ]);
  const buttonTextStyle = isGreen ? styles.greenButtonText : styles.buttonText;
  const leftIconPadding = text !== "" ? 10 : 0;

  return (
    <View style={styles.buttonContainer} accessibilityLabel={label}>
      <TouchableHighlight onPress={onPress} underlayColor={"#ffffff"}>
        <View
          style={[
            buttonStyle,
            { margin: margin },
            showDisabled
              ? { backgroundColor: "rgba(128, 128, 128, 0.5)" }
              : null,
            rightIcon || leftIcon.length !== 0 ? { paddingVertical: 11 } : null,
            isNarrow ? { paddingVertical: 11 } : null,
            { height: buttonHeight },
          ]}
        >
          {leftIcon.length !== 0
            ? <Ionicon
                name={leftIcon}
                style={[
                  buttonTextStyle,
                  smallIconStyle,
                  { paddingRight: leftIconPadding },
                ]}
              />
            : null}
          {fontAwesomeLeftIcon.length !== 0
            ? <FontAwesome
                name={fontAwesomeLeftIcon}
                style={[
                  buttonTextStyle,
                  smallIconStyle,
                  { paddingRight: leftIconPadding },
                ]}
              />
            : null}
          {showSpinner
            ? <ActivityIndicator
                color="#ffffff"
                animating={true}
                style={{
                  flex: -1,
                  paddingRight: 10,
                }}
              />
            : null}
          {text !== ""
            ? <Text
                numberOfLines={1}
                style={[buttonTextStyle, { fontSize: buttonFontSize }]}
              >
                {useShortText ? shortText : text}
              </Text>
            : null}
          {rightIcon
            ? <Ionicon
                name={"ios-arrow-forward"}
                style={[
                  buttonTextStyle,
                  iconStyle,
                  { paddingLeft: 10, flex: -1 },
                ]}
              />
            : null}
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default BevButton;
