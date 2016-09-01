import { AppRegistry } from 'react-native';
import React, { Component, PropTypes } from 'react';

import { Provider } from 'react-redux'

import MainUi from './src/MainUi'

import store from './src/configureStore'

class Bevegram extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainUi />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Bevegram', () => Bevegram);
