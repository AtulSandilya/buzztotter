import { Text, ViewPagerAndroid, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux'

import Contacts from './Contacts'
import Bevegrams from './Bevegrams'
import BevegramLocations from './BevegramLocations'

class MainViewPager extends Component {
  static propTypes = {
    updateMenuPosition: React.PropTypes.func,
    currentMenuPosition: React.PropTypes.number,
  }

  static defaultProps = {
    currentMenuPosition: 3,
  }

  onPageSelected(event){
    // This is explicitly called like a function
    this.props.updateMenuPosition(event.nativeEvent.position);
  }

  componentWillReceiveProps(nextProps){
    this.viewPager.setPageWithoutAnimation(nextProps.currentMenuPosition);
  }

  render() {
    return(
      <ViewPagerAndroid
        style={{flex: 1}}
        initialPage={0}
        onPageSelected={this.onPageSelected.bind(this)}
        ref={viewPager => {this.viewPager = viewPager; }}
      >
        <View style={{flex: 1}}>
          <Contacts />
        </View>
        <View style={{flex: 1}}>
          <Bevegrams />
        </View>
        <View style={{flex: 1}}>
          <BevegramLocations />
        </View>
        <View style={{flex: 1}}>
          <Deals />
        </View>
      </ViewPagerAndroid>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateMenuPosition: (position) => {
      dispatch({type: 'GOTO_VIEW', newPosition: position});
    },
  }
}

export default connect(undefined, mapDispatchToProps)(MainViewPager);

class Deals extends Component {
  render() {
    return(
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>
          Coming Soon!
        </Text>
      </View>
    );
  }
}
