import * as React from "react";
import { Image, Text, View } from "react-native";

import FacebookButton from "./FacebookButton";

import { WindowHeight, WindowWidth } from "../ReactNativeUtilities";
import { globalColors } from "./GlobalStyles";

export interface LoginProps {
  loginInProgress: boolean;
  requestLogin: () => void;
}

/* tslint:disable:no-magic-numbers */
const Login: React.StatelessComponent<LoginProps> = ({
  loginInProgress,
  requestLogin,
}) =>
  <View
    style={{
      flex: 1,
    }}
  >
    <View
      style={{
        alignItems: "center",
        backgroundColor: globalColors.bevPrimary,
        flex: 2,
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../../img/logos/logo-on-brown-big.png")}
        style={{
          height: WindowHeight * 0.3,
          width: WindowWidth * 0.8,
        }}
        resizeMode="contain"
      />
      <Text
        style={{
          color: "#333",
          fontSize: 25,
          marginTop: 35,
        }}
      >
        Sending Drinks Made Easy!
      </Text>
    </View>
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ flex: -1, alignItems: "center" }}>
        <FacebookButton
          text="Login with Facebook"
          size="large"
          onPress={requestLogin}
          showActivityIndicator={loginInProgress}
        />
      </View>
      <View
        style={{
          alignItems: "center",
          flex: -1,
          marginHorizontal: 30,
          marginTop: 30,
        }}
      >
        <Text>
          * We only use your Contacts to send and receive Bevegrams.
          Your privacy is important to us. We promise to never share your
          information with anyone for any reason.
        </Text>
      </View>
    </View>
  </View>;
export default Login;
