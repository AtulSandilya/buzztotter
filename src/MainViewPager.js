import React, { Component, PropTypes } from 'react';
import { BackAndroid, Text, View } from 'react-native';

import { connect } from 'react-redux';

import {sceneKeys} from './reducers/view';

import { Actions, Router, Scene } from 'react-native-router-flux';

import Contacts from './Contacts'
import Bevegrams from './Bevegrams'
import BevegramLocations from './BevegramLocations'

export default class MainViewPager extends Component {
  render() {
    return(
      <Router>
        <Scene key="mainUi">
          <Scene
            key={sceneKeys.contacts}
            component={Contacts}
            hideNavBar={true}
            initial={true}
          />
          <Scene
            key={sceneKeys.bevegrams}
            component={Bevegrams}
            hideNavBar={true}
          />
          <Scene
            key={sceneKeys.bevegramLocations}
            component={BevegramLocations}
            hideNavBar={true}
          />
          <Scene
            key={sceneKeys.history}
            component={Deals}
            hideNavBar={true}
          />
        </Scene>
      </Router>
    );
  }
}

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
