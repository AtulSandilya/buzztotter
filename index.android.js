import { AppRegistry } from 'react-native';
import React, { Component, PropTypes } from 'react';

import { Provider } from 'react-redux'
import {batchActions} from 'redux-batched-actions';
import PushNotification from 'react-native-push-notification';

import InitialRouter from './src/InitialRouter.js';

import store from './src/configureStore';

import {modalKeys} from './src/reducers/modals';

class Bevegram extends Component {
  render() {
    return (
      <Provider store={store}>
        <InitialRouter />
      </Provider>
    );
  }
}

PushNotification.configure({
  // When notification is clicked
  onNotification: function(notification) {
    store.dispatch(batchActions([
      {type: 'CLOSE_MODAL', modalKey: modalKeys.settingsModal},
      {type: 'GOTO_VIEW', newPosition: 1},
    ]))
  }
});

AppRegistry.registerComponent('Bevegram', () => Bevegram);
