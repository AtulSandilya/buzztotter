import { StyleSheet, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import MainNavButton from './MainNavButton'

import {colors} from './Styles'

const styles = StyleSheet.create({
    navContainer: {
        flex: 1,
        flexDirection: 'row',
    }
});

export default class MainNavButtons extends Component {
  static propTypes = {
    activeButtonPos: React.PropTypes.number,
  }

  static defaultProps = {
    activeButtonPos: 0,
  }

  render() {
    // let activeArray = [false, false, false, false];
    // activeArray[this.props.activeButtonPos] = true;
    return(
      <View style={styles.navContainer}>
        <MainNavButton
          label="Contacts"
          position={0}
        />
        <MainNavSeparator />
        <MainNavButton
          label="Bevegrams"
          position={1}
        />
        <MainNavSeparator />
        <MainNavButton
          label="Map"
          position={2}
        />
        <MainNavSeparator />
        <MainNavButton
          label="History"
          position={3}
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
