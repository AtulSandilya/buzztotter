import * as React from "react";
import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import theme, { SizeName } from "../theme";

import { textShadowForWhiteText } from "./BevText";

export type IconType =
  | "address"
  | "amex"
  | "alert"
  | "beer"
  | "birthday"
  | "businessHours"
  | "checkboxChecked"
  | "checkboxUnchecked"
  | "close"
  | "creditCard"
  | "decrease"
  | "dinersClub"
  | "discover"
  | "facebook"
  | "failure"
  | "increase"
  | "indifferent"
  | "jcb"
  | "leftArrow"
  | "link"
  | "location"
  | "lock"
  | "map"
  | "masterCard"
  | "messageRead"
  | "messageUnread"
  | "notice"
  | "notification"
  | "phone"
  | "redeem"
  | "refresh"
  | "rightArrow"
  | "search"
  | "send"
  | "sort"
  | "sortAlphabetical"
  | "sortReverseAlphabetical"
  | "spinner"
  | "success"
  | "support"
  | "thumbsDown"
  | "thumbsUp"
  | "time"
  | "verify"
  | "visa";

type IconSet = "fontAwesome" | "ionicons";

interface CustomIcon {
  icon: string;
  iconSet?: IconSet;
  lineHeight?: number;
  style?: any;
}

type IconTypes = { [icon in IconType]: string | CustomIcon };

const iconMap: IconTypes = {
  address: "globe",
  alert: "exclamation-circle",
  amex: "cc-amex",
  beer: {
    icon: "ios-beer",
    iconSet: "ionicons",
  },
  birthday: "birthday-cake",
  businessHours: "clock-o",
  checkboxChecked: "check-square-o",
  checkboxUnchecked: "square-o",
  close: "times-circle",
  creditCard: "credit-card",
  decrease: "minus-circle",
  dinersClub: "cc-diners-club",
  discover: "cc-discover",
  facebook: "facebook-official",
  failure: "warning",
  increase: "plus-circle",
  indifferent: "minus",
  jcb: "cc-jcb",
  leftArrow: "angle-left",
  link: "link",
  location: "map-marker",
  lock: "lock",
  map: "map",
  masterCard: "cc-mastercard",
  messageRead: "envelope-open",
  messageUnread: "envelope",
  notice: "exclamation",
  notification: "bell",
  phone: "phone",
  redeem: "beer",
  refresh: "refresh",
  rightArrow: "angle-right",
  search: "search",
  send: "paper-plane",
  sort: {
    icon: "signal",
    style: {
      transform: [{ rotate: "270deg" }],
    },
  },
  sortAlphabetical: "sort-alpha-asc",
  sortReverseAlphabetical: "sort-alpha-dsc",
  spinner: "",
  success: "check",
  support: "life-ring",
  thumbsDown: "thumbs-down",
  thumbsUp: "thumbs-up",
  time: "clock-o",
  verify: "key",
  visa: "cc-visa",
};

interface BevIconProps {
  iconType: IconType;
  size?: SizeName;
  color?: string;
  style?: ViewStyle;
}

const BevIcon: React.StatelessComponent<BevIconProps> = props => {
  const fontSize = props.size
    ? theme.font.size[props.size]
    : theme.font.size.normal;

  const thisIcon = iconMap[props.iconType];

  const iconName = typeof thisIcon === "string" ? thisIcon : thisIcon.icon;
  const iconSet =
    typeof thisIcon === "string" ? "fontAwesome" : thisIcon.iconSet;
  const iconCustomStyle = typeof thisIcon === "string" ? {} : thisIcon.style;
  const iconLineHeight =
    typeof thisIcon === "string" ? 1 : thisIcon.lineHeight || 1;
  const color = props.color ? props.color : theme.colors.uiIconColor;

  const iconTextStyle = StyleSheet.flatten([
    {
      color,
      fontSize,
      lineHeight: fontSize * iconLineHeight,
    },
    theme.colors.white === props.color ? textShadowForWhiteText : {},
    iconCustomStyle || {},
  ]);

  return (
    <View style={[props.style]}>
      {props.iconType === "spinner" ? (
        <View
          style={{ alignItems: "center", height: fontSize, width: fontSize }}
        >
          <ActivityIndicator color={color} />
        </View>
      ) : iconSet === "fontAwesome" || iconSet === undefined ? (
        <FontAwesome name={iconName} style={iconTextStyle} />
      ) : (
        <Ionicons name={iconName} style={iconTextStyle} />
      )}
    </View>
  );
};

export default BevIcon;
