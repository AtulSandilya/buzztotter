import * as React from 'react';
import { Component, PropTypes } from 'react';
import { Platform } from 'react-native';

import { Provider } from 'react-redux'
import {batchActions} from 'redux-batched-actions';

import {isAndroid} from './Utilities';

import CInitialRouter from './containers/CInitialRouter.js';

import store from './configureStore';

import {modalKeys} from './reducers/modals';

export default class Bevegram extends Component {
  constructor(props){
    super(props);

    if(isAndroid){
      console.log("Init push notification");
      const PushNotification = require('react-native-push-notification');
      PushNotification.configure({
        // When notification is clicked
        onNotification: function(notification) {
          store.dispatch(batchActions([
            {type: 'CLOSE_MODAL', modalKey: modalKeys.settingsModal},
            {type: 'GOTO_VIEW', newPosition: 1},
          ]))
        }
      });
    }
  }
  render() {
    return (
      <Provider store={store}>
        <CInitialRouter />
      </Provider>
    );
  }
}
