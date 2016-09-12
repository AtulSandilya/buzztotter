import { Dimensions, Image, Modal, Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import {connect} from 'react-redux';

import CenteredModal from '../CenteredModal';
import Settings from '../containers/Settings';

import {colors, styles} from '../Styles';

const Branding = ({settingsModalVisible, openSettings, closeSettings}) => (
  <View
    style={[{
      flex: 1,
      flexDirection: 'row',
    }, styles.bevColorPrimary]}
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
        underlayColor={colors.bevPrimary}
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
      <Settings />
    </CenteredModal>
  </View>
)

Branding.propTypes = {
  settingsModalVisible: React.PropTypes.bool.isRequired,
}

export default Branding;
