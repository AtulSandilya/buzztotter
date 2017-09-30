import * as React from "react";
import { Image, StyleSheet, ViewStyle } from "react-native";

import theme, { SizeName } from "../theme";

import BevShadow from "./BevShadow";

interface BevAvatarProps {
  imageUrl: string;
  size?: SizeName;
}

interface Styles {
  avatarImage: ViewStyle;
}

const BevAvatar: React.StatelessComponent<BevAvatarProps> = props => {
  const avatarSize = props.size
    ? theme.padding[props.size]
    : theme.padding.smallHero;
  const half = 0.5;
  const borderRadius = avatarSize * half;

  const imageSource =
    props.imageUrl.indexOf("BuzzOtter") !== -1
      ? require("../../img/logos/android-just-otter-icon.png")
      : { uri: props.imageUrl };

  const styles = StyleSheet.create<Styles>({
    avatarImage: {
      borderRadius,
      height: avatarSize,
      width: avatarSize,
      zIndex: 1000,
    },
  });

  return (
    <BevShadow borderRadius={borderRadius}>
      <Image source={imageSource} style={styles.avatarImage} />
    </BevShadow>
  );
};

export default BevAvatar;
