import React, { Component, PropTypes } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import TitleText from './TitleText'

import {colors} from './Styles'
import {app} from './Global'

const styles = StyleSheet.create({
  settingLine: {
      flex: 1,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: colors.subtleSeparator,
      marginBottom: 20,
  }
});

export default class Settings extends Component {
  constructor(props){
    super(props);
    this.state = {
      notifications: true,
      location: true,
    }
  }

  toggleSetting(keyValue){
    var updateObject = {};
    updateObject[keyValue] = !this.state[keyValue];
    this.setState(updateObject);
  }

  render() {
    return(
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
              onValueChange={(value) => this.toggleSetting('notifications')}
              value={this.state.notifications}
            />
          </SettingRight>
        </SettingLine>
        <SettingLine>
          <SettingLeft>
            <SettingName>Location:</SettingName>
          </SettingLeft>
          <SettingRight>
            <Switch
              onValueChange={(value) => this.toggleSetting('location')}
              value={this.state.location}
            />
          </SettingRight>
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
    );
  }
}

class SettingLeft extends Component {
  render() {
    return(
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
        }}
      >
        {this.props.children}
      </View>
    );
  }
}

class SettingRight extends Component {
  render() {
    return(
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
        }}
      >
        {this.props.children}
      </View>
    );
  }
}

class SettingLine extends Component {
  render() {
    return(
      <View style={styles.settingLine}>
        {this.props.children}
      </View>
    );
  }
}

class SettingName extends Component {
  render() {
    return(
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>{this.props.children}</Text>
    );
  }
}
