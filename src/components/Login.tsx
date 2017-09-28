import * as React from "react";
import { Image, TouchableHighlight, View } from "react-native";

import FacebookButton from "./FacebookButton";

import { WindowHeight, WindowWidth } from "../ReactNativeUtilities";
import theme from "../theme";
import BevText from "./BevText";

export interface LoginProps {
  loginInProgress: boolean;
  goToTermsAndConditions: () => void;
  requestLogin: () => void;
}

/* tslint:disable:no-magic-numbers */
const Login: React.StatelessComponent<LoginProps> = ({
  loginInProgress,
  goToTermsAndConditions,
  requestLogin,
}) => (
  <View
    style={{
      flex: 1,
    }}
  >
    <View
      style={{
        alignItems: "center",
        backgroundColor: theme.colors.bevPrimary,
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
      <BevText
        color={theme.colors.white}
        size={"extraLarge"}
        textStyle={{
          marginTop: theme.padding.extraLarge,
          textAlign: "center",
        }}
      >
        Sending & Receiving Drinks Made Easy!
      </BevText>
    </View>
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ flex: -1, alignItems: "center" }}>
        <FacebookButton
          text="Login with Facebook"
          size="largeNormal"
          onPress={requestLogin}
          showActivityIndicator={loginInProgress}
        />
      </View>
      <TouchableHighlight
        onPress={goToTermsAndConditions}
        underlayColor="transparent"
      >
        <View
          style={{
            alignItems: "center",
            flex: -1,
            marginHorizontal: theme.padding.large,
            marginTop: theme.padding.small,
          }}
        >
          <BevText size="smallNormal">
            {"By logging in, you agree to our"}
          </BevText>
          <BevText size="smallNormal" underline={true}>
            {"Terms & Privacy Policy"}
          </BevText>
        </View>
      </TouchableHighlight>
    </View>
  </View>
);
export default Login;
