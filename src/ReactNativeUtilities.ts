import { Dimensions, Platform, StatusBar } from "react-native";

import Color from "color";

import theme from "./theme";

export const isAndroid = Platform.OS === "android";
export const isIOS = Platform.OS === "ios";

const { height, width } = Dimensions.get("window");
export const WindowHeight = height;
export const WindowWidth = width;
const narrowWidth = 320;
export const isNarrow = WindowWidth <= narrowWidth;

const iOSStatusBarHeight = 20;
export const StatusBarHeight = isIOS
  ? iOSStatusBarHeight
  : isAndroid ? StatusBar.currentHeight : iOSStatusBarHeight;

// Returns one hex color between two colors: `startColor` -> fully desaturated
// `startColor` -> fully desaturated `endColor` -> `endColor`
// `startColorShift` determines when the `input` shifts from the start color
// to the end color. The distance from start color shift determines the amount
// of saturation either the start or end color.
const CalculateTwoColorShift = (
  input: number,
  startColorShift: number,
  startColor: string,
  endColor: string,
) => {
  if (input < startColorShift) {
    return Color(startColor).desaturate(input / startColorShift).hex();
  } else {
    return Color(endColor).desaturate(startColorShift / input).hex();
  }
};

export const CalcSuccessFailColor = (
  input: number,
  startRed: number,
  useBoldRed?: boolean,
): string => {
  const failureRed = useBoldRed ? theme.colors.failure : theme.colors.failureBg;
  return CalculateTwoColorShift(
    input,
    startRed,
    theme.colors.successBg,
    failureRed,
  );
};
