import React, { Component, PropTypes } from 'react';
import { Text } from 'react-native';

import { Actions, Router, Scene } from 'react-native-router-flux';

import MainUi from './MainUi';
import Login from './Login';

export default class InitialRouter extends Component {
  render() {
    return(
        <Router>
          <Scene key="root" hideNavBar={true}>
            <Scene key="loginScene" hideNavBar={true} component={Login} initial={true}/>
            <Scene key="mainScene" hideNavBar={true} component={MainUi} />
          </Scene>
        </Router>
    );
  }
}
