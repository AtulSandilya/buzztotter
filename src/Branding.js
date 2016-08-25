import { Dimensions, Image, Modal, Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import Settings from './Settings'
import {styles} from './Styles'

export default class Branding extends Component {
  constructor(props){
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  setModalVisible(visible){
    this.setState({modalVisible: visible});
  }

  static propTypes = {
    title: React.PropTypes.string,
  }

  static defaultProps = {
    title: "Does this work?"
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
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}
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
        <Modal
          animationType={"fade"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <View
            style={{flex: 1}}
          >
            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible)
              }}
            >
              <Text>Close</Text>
            </TouchableHighlight>
            <Settings />
          </View>
        </Modal>
      </View>
    );
  }
}
