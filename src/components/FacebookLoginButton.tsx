import * as React from "react";
import { Component } from 'react';
import {Text} from 'react-native';

import {Actions} from 'react-native-router-flux';

import { AccessToken, LoginManager } from 'react-native-fbsdk';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

export interface FacebookLoginButtonProps {
  userIsLoggedIn?: boolean;
  onLoginSuccessful?(): void;
  onGetTokenSuccessful?(token: string): void;
  logoutActions?(): void;
}

const FacebookLoginButton: React.StatelessComponent<FacebookLoginButtonProps> = ({
  userIsLoggedIn,
  onLoginSuccessful,
  onGetTokenSuccessful,
  logoutActions,
}) => (
  <FontAwesome.Button
    name="facebook"
    backgroundColor="#3b5998"
    size={userIsLoggedIn ? 18 : 24}
    style={{
      paddingHorizontal: 15,
      paddingVertical: 5,
    }}
    onPress={() => {
      if(!userIsLoggedIn){
        LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email', 'user_birthday'])
        .then((result) => {
          if(result.isCancelled){
            return
          }
          onLoginSuccessful();

          AccessToken.getCurrentAccessToken()
          .then((data) => {
            onGetTokenSuccessful(data.accessToken.toString());
          })
        })
      } else if(userIsLoggedIn) {
        LoginManager.logOut();
        logoutActions();
      }
    }}
  >
    <Text style={{
      color: '#ffffff',
      fontWeight: '600',
      backgroundColor: 'transparent',
      fontSize: userIsLoggedIn ? 14 : 16,
    }}>
    {userIsLoggedIn ? "Log Out" : "Login with Facebook"}
    </Text>
  </FontAwesome.Button>
)

export default FacebookLoginButton;
