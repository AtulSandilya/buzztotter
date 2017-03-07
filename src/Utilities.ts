import {
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';

import { DeviceLocation } from './reducers/redeemView';

export const isAndroid = Platform.OS === 'android';
export const isIOS  = Platform.OS === 'ios';

const {height, width} = Dimensions.get("window")
export const WindowHeight = height;
export const WindowWidth = width;
export const isNarrow = WindowWidth <= 320;

export const StatusBarHeight = isIOS ? 20 : (isAndroid ? StatusBar.currentHeight : 20);

export const StringifyDate = (): string => {
  return (new Date().toJSON());
}

export const LocationsMatch = (a: DeviceLocation, b: DeviceLocation, name: string): boolean => {
  const tolerance = 0.025;
  const latitudeDiff = Math.abs(Math.abs(a.latitude) - Math.abs(b.latitude));
  const longitudeDiff = Math.abs(Math.abs(a.longitude) - Math.abs(b.longitude));

  return (latitudeDiff < tolerance) && (longitudeDiff < tolerance)
}

export const Pluralize = (input: number, suffix: string = "s"): string => {
  return input !== 1 ? suffix : "";
}

