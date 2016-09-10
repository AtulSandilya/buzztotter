import { Dimensions, Image, Modal, Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import {connect} from 'react-redux';

import {modalKeys} from './reducers/modals';

import CenteredModal from './CenteredModal';
import Settings from './containers/Settings';

import {colors, styles} from './Styles';

class Branding extends Component {

  static propTypes = {
    settingsModalVisible: React.PropTypes.bool.isRequired,
  }

  render() {
    return (
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
            source={require('../img/logos/main-logo.png')}
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
            onPress={this.props.openSettings}
            underlayColor={colors.bevPrimary}
          >
            <Image
              source={require('../img/icons/settings-icon.png')}
              style={{
                flex: 1,
                resizeMode: 'contain',
                margin: 10,
              }}
            />
          </TouchableHighlight>
        </View>
        <CenteredModal
          isVisible={this.props.settingsModalVisible}
          closeFromParent={this.props.closeSettings}
        >
          <Settings />
        </CenteredModal>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settingsModalVisible: state.modals.settingsModal.isOpen,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openSettings: () => {
      dispatch({type: 'OPEN_MODAL', modalKey: modalKeys.settingsModal});
    },
    closeSettings: () => {
      dispatch({type: 'CLOSE_MODAL', modalKey: modalKeys.settingsModal});
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Branding);
