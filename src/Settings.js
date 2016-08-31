import React, { Component, PropTypes } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { connect } from 'react-redux'

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

class Settings extends Component {
  static propTypes = {
    notifications: React.PropTypes.bool,
    location: React.PropTypes.bool,
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
              onValueChange={this.props.onSettingToggle.bind(null, 'notifications')}
              value={this.props.notifications}
            />
          </SettingRight>
        </SettingLine>
        <SettingLine>
          <SettingLeft>
            <SettingName>Location:</SettingName>
          </SettingLeft>
          <SettingRight>
            <Switch
              onValueChange={this.props.onSettingToggle.bind(null, 'location')}
              value={this.props.location}
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

// Take the current state from the store and return an object. The keys of
// this object become props in the component
const mapStateToProps = (state) => {
  return {
    notifications: state.settings.notifications,
    location: state.settings.location,
  }
}

// The returned objects keys map to functions that happen when the prop is
// called like a function.
const mapDispatchToProps = (dispatch) => {
    return {
      // To pass a value from a component to this function via.
      // this.props.onSettingsToggle the value is `bind` to the prop. Remember
      // that the first arg to bind is `this` is necessary (here it is not
      // used so it is `null`) and anything after is passed to the function in
      // that order
      onSettingToggle: (settingKey) => {
        // The input to the dispatch function the action type (required) and any other
        // value you want to use in the reducer
        dispatch({type: 'TOGGLE_SETTING', settingName: settingKey})
      },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

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
