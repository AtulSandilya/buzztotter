import {
  Dimensions,
  Platform,
} from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const isIOS  = Platform.OS === 'ios';

export const isNarrow = Dimensions.get("window").width <= 320;
