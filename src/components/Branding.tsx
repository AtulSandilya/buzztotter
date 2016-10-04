import * as React from "react";
import { Component, PropTypes } from 'react';
import { Dimensions, Image, Modal, Text, TouchableHighlight, View } from 'react-native';

import {connect} from 'react-redux';

import CenteredModal from './CenteredModal';
import CSettings from '../containers/CSettings';

import {globalColors, globalStyles} from './GlobalStyles';

const Branding = ({settingsModalVisible, openSettings, closeSettings}) => (
  <View
    style={[{
      flex: 1,
      flexDirection: 'row',
    }, globalStyles.bevColorPrimary]}
  >
    <View
      style={{
        flex: 1,
        alignItems: 'flex-start',
      }}
    >
      <Image
        source={require('../../img/logos/main-logo.png')}
        style={{
          flex: 1,
          margin: 10,
          resizeMode: 'contain',
        }}
      />
    </View>
    <View
      style={{
        flex: 1,
        alignItems: 'flex-end',
      }}
    >
      <TouchableHighlight
        onPress={openSettings}
        underlayColor={globalColors.bevPrimary}
      >
        <Image
          source={require('../../img/icons/settings-icon.png')}
          style={{
            flex: 1,
            resizeMode: 'contain',
            margin: 10,
          }}
        />
      </TouchableHighlight>
    </View>
    <CenteredModal
      isVisible={settingsModalVisible}
      closeFromParent={closeSettings}
    >
      <CSettings />
    </CenteredModal>
  </View>
)

Branding.propTypes = {
  settingsModalVisible: React.PropTypes.bool.isRequired,
}

export default Branding;
