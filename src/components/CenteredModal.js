import React, { Component, PropTypes } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import {globalColors} from './GlobalStyles';

const styles = StyleSheet.create({
  outerView: {
    backgroundColor: '#222222',
    opacity: 20,
  },
  innerView: {
    backgroundColor: '#ffffff',
    opacity: 100,
  }
});

const calcDimensions = (dimensionProperty, innerSize) => {
  let full = Dimensions.get('window')[dimensionProperty]
  return {
    full: full,
    inner: full * innerSize,
    edge: (full - (full * innerSize)) / 2
  }
}

const CenteredModal = ({
  children,
  isVisible = false,
  bgOpacity = 0.6,
  heightPercent = 0.8,
  widthPercent = 0.9,
  animationType = 'fade',
  closeFromParent,
}) => {
  const width = calcDimensions('width', widthPercent);
  const height = calcDimensions('height', heightPercent);
  const cancelButtonSize = 25;

  return(
    <Modal
      animationType={animationType}
      transparent={true}
      visible={isVisible}
      onRequestClose={() => closeFromParent()}
    >
      <View style={{
        height: height.full,
        width: width.full,
      }}>
        <View style={{
          height: height.full,
          width: width.full,
          backgroundColor: 'rgba(34, 34, 34, ' + bgOpacity.toString() + ')',
          zIndex: 1,
        }}>
          <TouchableHighlight style={{
              height: height.full,
              width: width.full,
            }}
            underlayColor={'#222222'}
            onPress={() => closeFromParent()}
          >
          <Text> </Text>
          </TouchableHighlight>
        </View>
        <View style={{
          height: height.inner,
          width: width.inner,
          backgroundColor: '#ffffff',
          position: 'absolute',
          top: height.edge,
          left: width.edge,
          zIndex: 100,
        }}>
          <ScrollView style={{zIndex: 100, height: height.inner}}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

CenteredModal.propTypes = {
  isVisible: React.PropTypes.bool,
  closeFromParent: React.PropTypes.func,
  bgOpacity: React.PropTypes.number,
  children: React.PropTypes.element.isRequired,
  heightPercent: React.PropTypes.number,
  widthPercent: React.PropTypes.number,
  animationType: React.PropTypes.string,
}

export default CenteredModal;
