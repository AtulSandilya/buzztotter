import React, { Component, PropTypes } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import {settingsKeys} from '../reducers/settings';

import {isAndroid} from '../Utilities';

import TitleText from '../TitleText';
import BevButton from '../BevButton';

import {colors} from '../Styles';
import {app} from '../Global';

const styles = StyleSheet.create({
  settingLine: {
      flex: 1,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: colors.subtleSeparator,
      marginBottom: 20,
  }
});

const sendNotification = () => {
  if(isAndroid){
    const PushNotification = require('react-native-push-notification');
    PushNotification.localNotification({
      message: "Travis Caldwell sent you a Bevegram!",
      // Android Icons
      // Icon that shows in the drop down
      largeIcon: "ic_launcher",
      // Icon that shows on the status bar
      smallIcon: "ic_local_bar_black_48dp",
      from: 'Travis Caldwell',
    });
  } else {
    alert("Notifications are only supported on Android");
  }
}

export const Settings = ({notifications, location, onSettingToggle}) => (
  <View
    style={{
      flex: 1,
      padding: 20,
    }}
  >
    <View>
      <TitleText title="Settings" />
    </View>
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
          buttonText={"Send Notification"}
          bevButtonPressed={sendNotification}
        />
      </View>
    </SettingLine>
    <SettingLine>
      <SettingLeft>
        <SettingName>Version:</SettingName>
      </SettingLeft>
      <SettingRight>
        <Text>{app.version}</Text>
      </SettingRight>
    </SettingLine>
  </View>
)

Settings.propTypes = {
  notifications: React.PropTypes.bool.isRequired,
  location: React.PropTypes.bool.isRequired,
}

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
