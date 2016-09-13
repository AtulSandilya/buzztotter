import { Text, TouchableOpacity, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import {globalStyles} from './GlobalStyles.js'

const MainNavButton = ({
  label,
  activeScene,
  sceneKey,
  onButtonPress,
}) => {
  let isActive = sceneKey === activeScene;
  return(
    <TouchableOpacity
      onPress={() => onButtonPress(sceneKey)}
      style={{flex: 1}}
    >
      <View style={[{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }, isActive ? globalStyles.bevColorActiveSecondary : globalStyles.bevColorSecondary]}>
        <Text
          style={globalStyles.whiteText}
        >
        {label}</Text>
      </View>
    </TouchableOpacity>
  )
}

MainNavButton.propTypes = {
  activeScene: React.PropTypes.string.isRequired,
  sceneKey: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  onButtonPress: React.PropTypes.func.isRequired,
}

export default MainNavButton;
