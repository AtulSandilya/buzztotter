import * as React from "react";
import { Component} from 'react';
import {Text, TouchableOpacity, View, } from 'react-native';

import { AppInviteDialog } from 'react-native-fbsdk';

import Icon from 'react-native-vector-icons/Ionicons';

const FacebookAppInviteButton: React.StatelessComponent<{}> = () => {
  // TODO: Link this to the actual website
  const appLinkUrl = "https://fb.me/2145387155685498";

  return (
    <View
      style={{
        flex: -1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
      }}
    >
      <Icon.Button
        name="logo-facebook"
        backgroundColor="#3b5988"
        onPress={() => {
          AppInviteDialog.show({
            applinkUrl: appLinkUrl,
          })
          .then((result) => {
            return true;
          })
        }}
      >
        Invite Friends
      </Icon.Button>
    </View>
  )
}

export default FacebookAppInviteButton;
