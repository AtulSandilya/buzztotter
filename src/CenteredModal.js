import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

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

export default class CenteredModal extends Component {
  static propTypes = {
    isVisible: React.PropTypes.bool,
    closeFromParent: React.PropTypes.func,
    bgOpacity: React.PropTypes.number,
    children: React.PropTypes.element.isRequired,
    heightPercent: React.PropTypes.number,
    widthPercent: React.PropTypes.number,
    animationType: React.PropTypes.string,
  }

  static defaultProps = {
    isVisible: false,
    bgOpacity: 0.6,
    heightPercent: 0.7,
    widthPercent: 0.7,
    animationType: 'fade',
  }

  calcDimensions(dimensionProperty, innerSize){
    let full = Dimensions.get('window')[dimensionProperty]
    return {
      full: full,
      inner: full * innerSize,
      edge: (full - (full * innerSize)) / 2
    }
  }

  render() {
    let width = this.calcDimensions('width', this.props.widthPercent);
    let height = this.calcDimensions('height', this.props.heightPercent);

    return(
      <Modal
        animationType={this.props.animationType}
        transparent={true}
        visible={this.props.isVisible}
        onRequestClose={() => {}}
      >
        <View style={{
          height: height.full,
          width: width.full,
        }}>
          <View style={{
            height: height.full,
            width: width.full,
            backgroundColor: '#222222',
            opacity: this.props.bgOpacity,
            zIndex: 1,
          }}>
            <TouchableHighlight style={{
                height: height.full,
                width: width.full,
              }}
              underlayColor={'#222222'}
              onPress={() => this.props.closeFromParent()}
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
              {this.props.children}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}
