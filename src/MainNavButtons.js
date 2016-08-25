import { View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import MainNavButton from './MainNavButton'

import {colors, styles} from './Styles'

export default class MainNavButtons extends Component {
  static propTypes = {
    activeButtonPos: React.PropTypes.number,
    updateMenuPosition: React.PropTypes.func,
  }

  static defaultProps = {
    activeButtonPos: 0,
  }

  render() {
    let activeArray = [false, false, false, false];
    activeArray[this.props.activeButtonPos] = true;
    return(
      <View style={[{
        flex: 1,
        flexDirection: 'row'
      }, styles.bevColorSecondary]}>
        <MainNavButton
          label="Contacts"
          isActive={activeArray[0]}
          position={0}
          updateMenuPosition={this.props.updateMenuPosition}
        />
        <MainNavSeparator />
        <MainNavButton
          label="Bevegrams"
          isActive={activeArray[1]}
          position={1}
          updateMenuPosition={this.props.updateMenuPosition}
        />
        <MainNavSeparator />
        <MainNavButton
          label="Map"
          isActive={activeArray[2]}
          position={2}
          updateMenuPosition={this.props.updateMenuPosition}
        />
        <MainNavSeparator />
        <MainNavButton
          label="Deals"
          isActive={activeArray[3]}
          position={3}
          updateMenuPosition={this.props.updateMenuPosition}
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
