import { Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import {styles} from '../Styles.js'

const MainNavButton = ({
  label,
  activeScene,
  sceneKey,
  onButtonPress,
}) => {
  let isActive = sceneKey === activeScene;
  return(
    <TouchableHighlight
      onPress={() => onButtonPress(sceneKey)}
      style={{flex: 1}}
    >
      <View style={[{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }, isActive ? styles.bevColorActiveSecondary : styles.bevColorSecondary]}>
        <Text
          style={styles.whiteText}
        >
        {label}</Text>
      </View>
    </TouchableHighlight>
  )
}

MainNavButton.propTypes = {
  activeScene: React.PropTypes.string.isRequired,
  sceneKey: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  onButtonPress: React.PropTypes.func.isRequired,
}

export default MainNavButton;
