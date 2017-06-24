import {
  LayoutAnimation,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

import { isAndroid } from "../ReactNativeUtilities";

/* tslint:disable:object-literal-sort-keys */
export const globalColors = {
  // Tealish Green
  bevPrimary: "#8ED0BA",
  // Brown
  bevSecondary: "#8B5E3C",
  // Light Brown
  bevActiveSecondary: "#AC9774",
  // Light Grey
  lightSeparator: "#8E8E8E",
  // Dark Grey
  darkSeparator: "#717171",
  // Almost White
  subtleSeparator: "#dddddd",
  // Non emphasized text
  lightText: "#555555",
};

interface Styles {
  listRowSeparator: ViewStyle;
  titleText: TextStyle;
  importantText: TextStyle;
  heroText: TextStyle;
  sectionStartText: TextStyle;
  titleTextContainer: ViewStyle;
  bevColorPrimary: ViewStyle;
  bevColorSecondary: ViewStyle;
  bevColorActiveSecondary: ViewStyle;
  whiteText: TextStyle;
  bevContainer: ViewStyle;
  bevLine: ViewStyle;
  bevLineNoSep: ViewStyle;
  bevLineNoSepWithMargin: ViewStyle;
  bevLastLine: ViewStyle;
  bevLineTextTitle: TextStyle;
  bevLineText: TextStyle;
  bevMultiLineText: TextStyle;
  bevLineLeft: ViewStyle;
  bevLineRight: ViewStyle;
  bevLineWideRight: ViewStyle;
  bevIcon: ViewStyle;
  bevTipText: TextStyle;
}

export const globalStyles = StyleSheet.create<Styles>({
  listRowSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: globalColors.subtleSeparator,
  },
  titleText: {
    color: globalColors.bevPrimary,
    fontSize: 30,
    paddingBottom: 10,
    fontWeight: "300",
  },
  heroText: {
    color: globalColors.lightText,
    fontSize: 40,
    fontWeight: "300",
  },
  sectionStartText: {
    color: globalColors.lightText,
    fontSize: 16,
    fontWeight: "300",
  },
  importantText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  titleTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: globalColors.subtleSeparator,
  },
  bevColorPrimary: {
    backgroundColor: globalColors.bevPrimary,
  },

  bevColorSecondary: {
    backgroundColor: globalColors.bevSecondary,
  },

  bevColorActiveSecondary: {
    backgroundColor: globalColors.bevActiveSecondary,
  },

  whiteText: {
    color: "#ffffff",
  },
  bevContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  bevLine: {
    flex: -1,
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: globalColors.subtleSeparator,
    paddingBottom: 10,
    marginBottom: 15,
  },
  bevLineNoSep: {
    flex: -1,
    flexDirection: "row",
    paddingBottom: 10,
  },
  bevLineNoSepWithMargin: {
    flex: -1,
    flexDirection: "row",
    paddingBottom: 10,
    marginBottom: 15,
  },
  bevLastLine: {
    flex: -1,
    flexDirection: "row",
  },
  bevLineTextTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bevLineText: {
    fontSize: 20,
  },
  bevMultiLineText: {
    fontSize: 20,
    lineHeight: 30,
  },
  bevLineLeft: {
    flex: -1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  bevLineRight: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  bevLineWideRight: {
    flex: 2,
    alignItems: "flex-end",
    paddingRight: 10,
  },
  bevIcon: {
    flex: -1,
    width: 28,
    height: 28,
  },
  bevTipText: {
    color: "#888888",
    fontSize: 10,
  },
});

const animationDuration = 80;

const defaultAnimation = {
  type: LayoutAnimation.Types.easeInEaseOut,
  property: LayoutAnimation.Properties.opacity,
};

export const BevLayoutAnimation = () => {
  LayoutAnimation.configureNext({
    duration: animationDuration,
    create: defaultAnimation,
    update: defaultAnimation,
  });
};
