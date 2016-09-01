import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';

import {connect} from 'react-redux';

import Branding from './Branding'
import MainNavButtons from './MainNavButtons'
import MainViewPager from './MainViewPager'

class MainUi extends Component {
  render() {
    return(
      <View style={{
        flex: 1,
      }}>
        <View style={{flex: 1}}>
          <Branding />
        </View>
        <View style={{flex: 8}}>
          <MainViewPager
            currentMenuPosition={this.props.menuPosition}
          />
        </View>
        <View style={{flex: 1}}>
          <MainNavButtons
            activeButtonPos={this.props.menuPosition}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  console.log("Main ui map state to props");
  console.log(state);
  return {
    menuPosition: state.view.currentView,
  }
}

export default connect(mapStateToProps)(MainUi);
