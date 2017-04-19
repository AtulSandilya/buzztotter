import * as React from 'react';
import { Component } from 'react';
import {
  Platform,
  StatusBar,
  View,
} from 'react-native';

import { Provider } from 'react-redux'

import CInitialRouter from './containers/CInitialRouter.js';

import store from './configureStore';

interface BevegramState {
  store: any;
}

export default class Bevegram extends Component<{}, BevegramState> {

  constructor(props) {
    super(props);

    this.state = {
      store: store,
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
