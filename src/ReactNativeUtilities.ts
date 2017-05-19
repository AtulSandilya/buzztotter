import {
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";

export const isAndroid = Platform.OS === "android";
export const isIOS  = Platform.OS === "ios";

const {height, width} = Dimensions.get("window");
export const WindowHeight = height;
export const WindowWidth = width;
const narrowWidth = 320;
export const isNarrow = WindowWidth <= narrowWidth;

const iOSStatusBarHeight = 20;
export const StatusBarHeight = isIOS ? iOSStatusBarHeight : (isAndroid ? StatusBar.currentHeight : iOSStatusBarHeight);
