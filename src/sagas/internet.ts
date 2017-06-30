import { Alert } from "react-native";

import { delay } from "redux-saga";
import { call, fork, put, select, take } from "redux-saga/effects";

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
        yield put({ type: "SHOW_NO_INTERNET_CONNECTION_BANNER" });
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
) =>
  fork(function*() {
    while (true) {
      const action = yield take(pattern);

      const thisIsConnected = yield call(isConnected, errorType);
      if (thisIsConnected) {
        yield fork(saga);
      }
    }
  });
