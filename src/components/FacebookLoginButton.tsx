import * as React from "react";
import { Component, PropTypes } from 'react';

import { LoginButton, AccessToken } from 'react-native-fbsdk';

interface FacebookLoginButtonProps {
  loginDispatch?(token: string): void;
  logoutDispatch?(): void;
}

const FacebookLoginButton: React.StatelessComponent<FacebookLoginButtonProps> = ({loginDispatch, logoutDispatch}) => (
  <LoginButton
    readPermissions={['public_profile', 'user_friends', 'email', 'user_birthday']}
    onLoginFinished={(error, result) => {
      if(error){
        alert("Login error: " + result.error);
      } else if (result.isCancelled){
        alert("Login cancelled");
      } else {
        AccessToken.getCurrentAccessToken().then(
          (data) => {
            if(loginDispatch){
              loginDispatch(data.accessToken.toString());
            }
          }
        )
      }
    }}
    onLogoutFinished={() => {
      if(logoutDispatch){
        logoutDispatch();
      }
    }}
  />
)

export default FacebookLoginButton;
