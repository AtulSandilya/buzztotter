import * as React from "react";
import { Component } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

export interface FacebookLoginButtonProps {
  text: string;
  size: "large" | "normal";
  onPress: () => void;
  showActivityIndicator?: boolean;
  marginTop?: number;
}

const FacebookButton: React.StatelessComponent<
  FacebookLoginButtonProps
> = props => {
  /* tslint:disable:no-magic-numbers */
  /* tslint:disable:jsx-alignment */
  return (
    <View
      style={{
        alignItems: "center",
        flex: -1,
        justifyContent: "center",
        marginTop: props.marginTop ? props.marginTop : 0,
      }}
    >
      <Icon.Button
        name="logo-facebook"
        backgroundColor="#3b5998"
        size={props.size === "large" ? 24 : 18}
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
      </Icon.Button>
    </View>
  );
};

export default FacebookButton;
