import { StyleSheet, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import CMainNavButton from './containers/CMainNavButton'

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
        <CMainNavButton
          label="Contacts"
          sceneKey={sceneKeys.contacts}
        />
        <MainNavSeparator />
        <CMainNavButton
          label="Bevegrams"
          sceneKey={sceneKeys.bevegrams}
        />
        <MainNavSeparator />
        <CMainNavButton
          label="Map"
          sceneKey={sceneKeys.bevegramLocations}
        />
        <MainNavSeparator />
        <CMainNavButton
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
