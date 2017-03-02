import * as React from "react";
import { Component, PropTypes } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import FCM from 'react-native-fcm';

import {settingsKeys} from '../reducers/settings';

import {isAndroid} from '../Utilities';

import RouteWithNavBarWrapper from './RouteWithNavBarWrapper';
import TitleText from './TitleText';
import BevButton from './BevButton';
import CFacebookLoginButton from '../containers/CFacebookLoginButton';

import {globalColors} from './GlobalStyles';

interface Style {
  settingLine: React.ViewStyle;
}

const styles = StyleSheet.create<Style>({
  settingLine: {
      flex: 1,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: globalColors.subtleSeparator,
      marginBottom: 20,
  }
});

const sendNotification = () => {
  if(isAndroid){
    FCM.presentLocalNotification({
      title: "Today is Travis Caldwell's Birthday!",
      body: "Tap to buy him a Bevegram",
      large_icon: "ic_launcher",
      icon: "ic_cake_white_48dp",
      show_in_foreground: true,
      priority: "max",
      on_click: "SEND_BEVEGRAM_TO_CONTACT",
    })
  } else {
    alert("Notifications are only supported on Android");
  }
}

interface SettingsProps {
  notifications: boolean;
  location: boolean;
  version: string;
  onSettingToggle(string): void;
  logoutActions(): void;
}

export const Settings: React.StatelessComponent<SettingsProps> = ({notifications, location, version, onSettingToggle, logoutActions}) => (
  <RouteWithNavBarWrapper>
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <SettingLine>
        <SettingLeft>
          <SettingName>Notifications:</SettingName>
        </SettingLeft>
        <SettingRight>
          <Switch
            onValueChange={() => onSettingToggle(settingsKeys.notifications)}
            value={notifications}
          />
        </SettingRight>
      </SettingLine>
      <SettingLine>
        <SettingLeft>
          <SettingName>Location:</SettingName>
        </SettingLeft>
        <SettingRight>
          <Switch
            onValueChange={() => onSettingToggle(settingsKeys.location)}
            value={location}
          />
        </SettingRight>
      </SettingLine>
      <SettingLine>
        <SettingLeft>
          <SettingName>Test Notification:</SettingName>
        </SettingLeft>
        <View style={{
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
          top: -15,
        }}>
          <BevButton
            text={"Send Notification"}
            shortText={"Send Notification"}
            label="Send Notification Button"
            onPress={sendNotification}
          />
        </View>
      </SettingLine>
      <SettingLine>
        <SettingLeft>
          <SettingName>Version:</SettingName>
        </SettingLeft>
        <SettingRight>
          <Text>{version}</Text>
        </SettingRight>
      </SettingLine>
      <SettingLine>
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <CFacebookLoginButton
            logoutActions={logoutActions}
          />
        </View>
      </SettingLine>
    </View>
  </RouteWithNavBarWrapper>
)

const SettingLeft = (props) => (
  <View
    style={{
      flex: 1,
      alignItems: 'flex-start',
    }}
  >
    {props.children}
  </View>
);

const SettingRight = (props) => (
  <View
    style={{
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
    }}
  >
    {props.children}
  </View>
);

const SettingLine = (props) => (
  <View style={styles.settingLine}>
    {props.children}
  </View>
);

const SettingName = (props) => (
  <Text style={{fontSize: 20, fontWeight: 'bold'}}>{props.children}</Text>
);
