import { Alert, ToastAndroid } from "react-native";

import { delay } from "redux-saga";
import { call, fork, put, select, take } from "redux-saga/effects";

import { isAndroid } from "../ReactNativeUtilities";

type internetErrorMessageTypes = "banner" | "alert" | "none";

export function* isConnected(
  errorType: internetErrorMessageTypes,
  PrettyAction?: string,
) {
  const isConnected = yield select<{ network: { isConnected: boolean } }>(
    state => state.network.isConnected,
  );

  if (!isConnected) {
    switch (errorType) {
      case "banner":
        // Currently react-native (0.45.1) on Android doesn't support clipped
        // views, a necessary requirement of `Banner`. The workaround is to
        // use ToastAndroid and wait until Android supports `overflow: visible`
        if (isAndroid) {
          ToastAndroid.show(
            "No Internet Connection!",
            ToastAndroid.LONG,
          );
        } else {
          yield put({ type: "SHOW_NO_INTERNET_CONNECTION_BANNER" });
        }
        break;
      case "alert":
        if (PrettyAction) {
          alert(`${PrettyAction} requires internet connectivity!`);
        } else {
          Alert.alert("Connection Error", `No Internet Connection!`, [
            { text: "OK" },
          ]);
        }
        break;
      case "none":
        break;
    }
  }

  return isConnected;
}

// Based on https://redux-saga.js.org/docs/api/#takeeverypattern-saga-args
export const takeEveryIfInternetConnected = (
  pattern: string,
  saga: any,
  errorType: internetErrorMessageTypes,
  prettyAction?: string,
) =>
  fork(function*() {
    while (true) {
      const action = yield take(pattern);

      const thisIsConnected = yield call(isConnected, errorType, prettyAction);
      if (thisIsConnected) {
        yield fork(saga, action);
      }
    }
  });

export class InternetNotConnectedError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "InternetNotConnected";
  }
}
