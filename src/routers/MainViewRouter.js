import React, { Component, PropTypes } from 'react';
import { BackAndroid, Text, View } from 'react-native';

import { connect } from 'react-redux';

import {sceneKeys} from '../reducers/view';

import { Actions, Router, Scene } from 'react-native-router-flux';

import CContacts from '../containers/CContacts';
import CBevegrams from '../containers/CBevegrams';
import BevegramLocations from '../containers/BevegramLocations';

export default class MainViewRouter extends Component {
  render() {
    return(
      <Router>
        <Scene key="mainUi">
          <Scene
            key={sceneKeys.contacts}
            component={CContacts}
            hideNavBar={true}
            initial={true}
          />
          <Scene
            key={sceneKeys.bevegrams}
            component={CBevegrams}
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
