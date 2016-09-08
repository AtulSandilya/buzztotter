import { Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import {styles} from './Styles.js'

class MainNavButton extends Component {

  static propTypes = {
    label: React.PropTypes.string.isRequired,
    activeButtonPos: React.PropTypes.number,
    position: React.PropTypes.number,
    onButtonPress: React.PropTypes.func,
  }

  isActive(){
    return this.props.position === this.props.activeButtonPos;
  }

  render() {
    return(
      <TouchableHighlight
        onPress={this.props.onButtonPress.bind(null, this.props.position)}
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
    activeButtonPos: state.view.currentView,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onButtonPress: (position) => {
      dispatch({type: 'GOTO_VIEW', newPosition: position});
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainNavButton);
