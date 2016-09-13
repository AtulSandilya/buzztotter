import { StyleSheet, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import CMainNavButton from '../containers/CMainNavButton'

import {sceneKeys} from '../reducers/view';

import {globalColors} from './GlobalStyles';

const styles = StyleSheet.create({
    navContainer: {
        flex: 1,
        flexDirection: 'row',
    }
});

const MainNavButtons = () => (
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
)

const MainNavSeparator = () => (
  <View
    style={{
      backgroundColor: globalColors.bevActiveSecondary,
      opacity: 50,
      alignSelf: 'stretch',
      width: 1,
    }}
  />
)

export default MainNavButtons;
