import * as React from "react";
import { Component, PropTypes } from 'react';

import { LoginButton, AccessToken } from 'react-native-fbsdk';

const FacebookLoginButton = ({loginDispatch = () => {}, logoutDispatch = () => {}}) => (
  <LoginButton
    readPermissions={['public_profile', 'user_friends', 'email']}
    onLoginFinished={(error, result) => {
      if(error){
        alert("Login error: " + result.error);
      } else if (result.isCancelled){
        alert("Login cancelled");
      } else {
        AccessToken.getCurrentAccessToken().then(
          (data) => {
            loginDispatch(data.accessToken.toString());
          }
        )
      }
    }}
    onLogoutFinished={() => {
      logoutDispatch();
    }}
  />
)

export default FacebookLoginButton;
