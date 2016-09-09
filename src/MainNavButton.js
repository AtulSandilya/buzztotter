import { Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import {sceneOrder} from './reducers/view';

import {styles} from './Styles.js'

class MainNavButton extends Component {

  static propTypes = {
    label: React.PropTypes.string.isRequired,
    activeButtonPos: React.PropTypes.number,
    position: React.PropTypes.number,
    onButtonPress: React.PropTypes.func,
  }

  onPress(){
    this.props.onButtonPress(this.props.sceneKey);
  }

  isActive(){
    return this.props.sceneKey === this.props.activeScene;
  }

  render() {
    return(
      <TouchableHighlight
        onPress={this.onPress.bind(this)}
        style={{flex: 1}}
      >
        <View style={[{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }, this.isActive() ? styles.bevColorActiveSecondary : styles.bevColorSecondary]}>
          <Text
            style={styles.whiteText}
          >
          {this.props.label}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activeScene: state.view[0],
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onButtonPress: (nextViewKey) => {
      dispatch({type: 'GOTO_VIEW', newScene: nextViewKey});
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainNavButton);
