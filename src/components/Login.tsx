import * as React from "react";
import { Component, PropTypes } from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';

import CFacebookLoginButton from '../containers/CFacebookLoginButton';

import {globalColors} from './GlobalStyles';
import {WindowHeight, WindowWidth} from '../Utilities';

export interface LoginProps {
  isLoggedIn: boolean;
  onSuccessfulFacebookLogin(): void;
  requestFacebookData(token: string): void;
}

const Login: React.StatelessComponent<LoginProps> = ({
  isLoggedIn,
  onSuccessfulFacebookLogin,
  requestFacebookData,
}) => (
  <View style={{flex: 1}}>
    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: globalColors.bevPrimary}}>
      <Image
        source={require('../../img/logos/logo-on-brown-big.png')}
        style={{
          width: WindowWidth * 0.8,
          height: WindowHeight * 0.3,
        }}
        resizeMode="contain"
      />
      <Text style={{
        fontSize: 25,
        marginTop: 35,
        color: '#333',
      }}
      >
        Sending Drinks Made Easy!
      </Text>
    </View>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View style={{flex: -1, alignItems: 'center'}}>
        <CFacebookLoginButton
          onLoginSuccessful={onSuccessfulFacebookLogin}
          onGetTokenSuccessful={requestFacebookData}
        />
      </View>
      <View style={{flex: -1, alignItems: 'center', marginTop: 30, marginHorizontal: 30}}>
        <Text>
          * We only use your Contacts to send and receive Bevegrams.
          Your privacy is important to us. We promise to never share your information with anyone for any reason.
        </Text>
      </View>
    </View>
  </View>
)

export default Login;
