import * as React from "react";
import { Component } from "react";
import { ActivityIndicator, Text } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

export interface FacebookLoginButtonProps {
  text: string;
  theme: "login" | "logout";
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
      size={props.theme === "logout" ? 18 : 24}
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
          fontSize: props.theme === "logout" ? 14 : 16,
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
