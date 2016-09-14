import React, { Component, PropTypes } from 'react';
import { Text } from 'react-native';

import { connect } from 'react-redux';

import { Actions, Router, Scene } from 'react-native-router-flux';

import store from '../configureStore';

import MainUi from '../components/MainUi';
import CLogin from '../containers/CLogin';

const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="loginScene" hideNavBar={true} component={CLogin} initial={true}/>
    <Scene key="mainScene" hideNavBar={true} component={MainUi} />
  </Scene>
)

const CRouter = connect()(Router);

export default class InitialRouter extends Component {
  render() {
    return(
      <CRouter
        scenes={scenes}
      />
    );
  }
}
