import * as React from "react";
import { Component} from 'react';
import {Text, TouchableOpacity, View, } from 'react-native';

import { AppInviteDialog } from 'react-native-fbsdk';

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
      <TouchableOpacity
        style={{
          flex: -1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#3b5998',
          borderRadius: 3,
        }}
        onPress={() => {
          AppInviteDialog.show({
            applinkUrl: appLinkUrl,
          })
          .then((result) => {
            return true;
          })
        }}
      >
        <Text
          style={{
            color: '#ffffff',
            padding: 10,
          }}
        >
          Invite Friends
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default FacebookAppInviteButton;
