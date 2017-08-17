import * as React from "react";
import { Component } from "react";
import { StatusBar, View } from "react-native";
import PerfMonitor from "react-native/Libraries/Performance/RCTRenderingPerf";

import { withNetworkConnectivity } from "react-native-offline";
import { Provider } from "react-redux";

import CRouter from "./containers/CRouter.js";

import store from "./configureStore";

interface BevegramState {
  store: any;
}

let Router = () => <CRouter />;

Router = withNetworkConnectivity({
  withRedux: true,
})(Router);

export default class Bevegram extends Component<{}, BevegramState> {
  constructor(props) {
    super(props);

    this.state = {
      store,
    };
  }

  public componentDidMount() {
    // if (__DEV__ === true) {
    //   const perfMonitorStartDelay = 500;
    //   const perfMonitorLen = 10000;
    //   PerfMonitor.toggle();

    //   setTimeout(() => {
    //     PerfMonitor.start();
    //     setTimeout(() => {
    //       PerfMonitor.stop();
    //     }, perfMonitorLen);
    //   }, perfMonitorStartDelay);
    // }
  }

  public render() {
    // Holding the store in state allows hot reloading
    return (
      <Provider store={this.state.store}>
        <View style={{ flex: 1 }}>
          <StatusBar
            translucent={true}
            backgroundColor={"rgba(0, 0, 0, 0.20)"}
          />
          <Router />
        </View>
      </Provider>
    );
  }
}
