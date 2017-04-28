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
export const isNarrow = WindowWidth <= 320;

export const StatusBarHeight = isIOS ? 20 : (isAndroid ? StatusBar.currentHeight : 20);

