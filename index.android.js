import { AppRegistry } from 'react-native';
import React, { Component, PropTypes } from 'react';

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import MainUi from './src/MainUi'

import {colors, styles} from './src/Styles'

import settings from './src/reducers'

function configureStore(settings){
  const store = createStore(settings);

  if(module.hot){
    module.hot.accept(() => {
      const nextRootReducer = require('./src/reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

let store = configureStore(settings)

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
