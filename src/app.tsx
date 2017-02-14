import * as React from 'react';
import { Component, PropTypes } from 'react';
import {
  Platform,
  StatusBar,
  View,
} from 'react-native';

import FCM from 'react-native-fcm';

import { Provider } from 'react-redux'

import {isAndroid} from './Utilities';

import CInitialRouter from './containers/CInitialRouter.js';

import store from './configureStore';

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
    store.dispatch({type: 'SAVE_FCM_TOKEN', payload: {
      fcmToken: token
    }});
  }

  componentDidMount() {
    FCM.requestPermissions();
    FCM.getFCMToken().then((token) => {
      this.storeFCMToken(token);
    })

    this.notificationListener = FCM.on('notification', (notif) => {
      switch(notif.on_click) {
        case 'SEND_BEVEGRAM_TO_CONTACT':
          store.dispatch({type: 'SEND_BEVEGRAM_TO_CONTACT_VIA_NOTIFICATION', payload: {
            facebookId: notif.facebookId,
        }})
        default:
          // Do Nothing???
      }
    })

    this.refreshTokenListener = FCM.on('refreshToken', (token) => {
      this.storeFCMToken(token);
    })
  }

  componentWillUnmount() {
    this.notificationListener.remove();
    this.refreshTokenListener.remove();
  }

  render() {
    // Holding the store in state allows hot reloading
    return (
      <Provider store={this.state.store}>
        <View style={{flex: 1}}>
          <StatusBar
            translucent={true}
            backgroundColor={"rgba(0, 0, 0, 0.25)"}
          />
          <CInitialRouter />
        </View>
      </Provider>
    );
  }
}
