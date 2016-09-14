import React, { Component, PropTypes } from 'react';
import { BackAndroid, Text, View } from 'react-native';

import { connect } from 'react-redux';

import store from '../configureStore.js';

import {sceneKeys} from '../reducers/view';

import { Actions, Router, Scene } from 'react-native-router-flux';

import CContacts from '../containers/CContacts';
import CBevegrams from '../containers/CBevegrams';
import CBevegramLocations from '../containers/CBevegramLocations';

export default class MainViewRouter extends Component {
  render() {
    return(
      <Router
        backAndroidHandler={() => {store.dispatch({type: 'GOBACK_VIEW'}); return true}}
      >
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
            component={CBevegramLocations}
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
