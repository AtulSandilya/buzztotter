import * as React from 'react';
import { Component, PropTypes } from 'react';
import {
  Platform,
  StatusBar,
  View,
} from 'react-native';

import { Provider } from 'react-redux'

import {isAndroid} from './Utilities';

import CInitialRouter from './containers/CInitialRouter.js';

import store from './configureStore';

export default class Bevegram extends Component<{}, {}> {
  constructor(props){
    super(props);

    if(isAndroid){
      console.log("Init push notification");
      const PushNotification = require('react-native-push-notification');
      PushNotification.configure({
        // When notification is clicked
        onNotification: function(notification) {
          store.dispatch({type: "GO_TO_ROUTE", payload: {
            route: "SendBevegram",
            // TODO: Get data for sending,
          }});
        }
      });
    }
  }
  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <StatusBar
            translucent={true}
            backgroundColor={"transparent"}
          />
          <CInitialRouter />
        </View>
      </Provider>
    );
  }
}
