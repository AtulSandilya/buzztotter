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
import {NotificationActions} from './api/notifications';
import {sceneOrder, sceneKeys} from './reducers/view';

interface BevegramState {
  store: any;
}

export default class Bevegram extends Component<{}, BevegramState> {
  notificationListener: any;
  refreshTokenListener: any;

  constructor(props) {
    super(props);

    this.state = {
      store: store,
    }
  }

  storeFCMToken(token) {
    store.dispatch({type: 'UPDATE_FCM_TOKEN', payload: {
      fcmToken: token
    }});
  }

  onNotificationClick(payload) {
    switch(payload.action) {
      case NotificationActions.ShowNewReceivedBevegrams:
        this.showNewReceivedBevegrams();
      case NotificationActions.ShowUpcomingBirthdays:
        store.dispatch({type: 'SEND_BEVEGRAM_TO_CONTACT_VIA_NOTIFICATION', payload: {
          facebookId: payload.facebookId,
        }})
      default:
        return;
    }
  }

  showNewReceivedBevegrams() {
    store.dispatch({type: 'GO_TO_ROUTE', payload: {
      route: "MainUi",
    }});
    store.dispatch({type: 'GOTO_VIEW', newScene: sceneOrder[sceneKeys.bevegrams]});
  }

  componentDidMount() {
    if(isAndroid){
      const FCM = require('react-native-fcm');
      FCM.requestPermissions();
      FCM.getFCMToken().then((token) => {
        this.storeFCMToken(token);
      })

      this.notificationListener = FCM.on('notification', (payload) => {
        // There are 3 notification situations to handle here
        // 1. App is in the foreground
        // 2. App is in the background and notification clicked
        // (payload.opened_from_tray is 1)
        // 3. App is not running (caught in FCM.getInitialNotification)

        if(payload.open_from_tray === 1){
          this.onNotificationClick(payload);
        } else {
          switch(payload.action) {
            case NotificationActions.ShowNewReceivedBevegrams:
              store.dispatch({type: 'ADD_RECEIVED_BEVEGRAM_TO_BADGE', payload: {
                // Should this badge show the number of bevegrams received or
                // quantity: payload.quantity,
                quantity: 1,
              }})
              store.dispatch({type: 'FETCH_RECEIVED_BEVEGRAMS'});
            case NotificationActions.ShowUpcomingBirthdays:
              // Do other thing
            default:
              return;
          }
        }

      })

      FCM.getInitialNotification().then((payload) => {
        // getInitialNotification is clicking the notification when the app is
        // closed
        this.onNotificationClick(payload);
      })

      this.refreshTokenListener = FCM.on('refreshToken', (token) => {
        this.storeFCMToken(token);
      })
    }
  }

  componentWillUnmount() {
    if(isAndroid){
      this.notificationListener.remove();
      this.refreshTokenListener.remove();
    }
  }

  render() {
    // Holding the store in state allows hot reloading
    return (
      <Provider store={this.state.store}>
        <View style={{flex: 1}}>
          <StatusBar
            translucent={true}
            backgroundColor={"rgba(0, 0, 0, 0.20)"}
          />
          <CInitialRouter />
        </View>
      </Provider>
    );
  }
}
