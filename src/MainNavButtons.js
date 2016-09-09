import { StyleSheet, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import MainNavButton from './MainNavButton'

import {sceneKeys} from './reducers/view';

import {colors} from './Styles'

const styles = StyleSheet.create({
    navContainer: {
        flex: 1,
        flexDirection: 'row',
    }
});

export default class MainNavButtons extends Component {
  render() {
    return(
      <View style={styles.navContainer}>
        <MainNavButton
          label="Contacts"
          sceneKey={sceneKeys.contacts}
        />
        <MainNavSeparator />
        <MainNavButton
          label="Bevegrams"
          sceneKey={sceneKeys.bevegrams}
        />
        <MainNavSeparator />
        <MainNavButton
          label="Map"
          sceneKey={sceneKeys.bevegramLocations}
        />
        <MainNavSeparator />
        <MainNavButton
          label="History"
          sceneKey={sceneKeys.history}
        />
      </View>
    );
  }
}

class MainNavSeparator extends Component {
  render() {
    return(
      <View
        style={{
          backgroundColor: colors.bevActiveSecondary,
          opacity: 50,
          alignSelf: 'stretch',
          width: 1,
        }}
      />
    );
  }
}
