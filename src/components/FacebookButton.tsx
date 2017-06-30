import * as React from "react";
import { Component } from "react";
import { ActivityIndicator, Text } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

export interface FacebookLoginButtonProps {
  text: string;
  size: "large" | "normal";
  onPress: () => void;
  showActivityIndicator?: boolean;
}

const FacebookButton: React.StatelessComponent<
  FacebookLoginButtonProps
> = props => {
  /* tslint:disable:no-magic-numbers */
  /* tslint:disable:jsx-alignment */
  return (
    <FontAwesome.Button
      name="facebook"
      backgroundColor="#3b5998"
      size={props.size === "large" ? 24 : 18}
      style={{
        paddingHorizontal: 15,
        paddingVertical: 5,
      }}
      onPress={props.onPress}
    >
      <Text
        style={{
          backgroundColor: "transparent",
          color: "#ffffff",
          fontSize: props.size === "large" ? 16 : 14,
          fontWeight: "600",
        }}
      >
        {props.text}
      </Text>
      {props.showActivityIndicator
        ? <ActivityIndicator color="#ffffff" style={{paddingLeft: 15}} />
        : null}
    </FontAwesome.Button>
  );
};

export default FacebookButton;
