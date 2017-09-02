import { Alert } from "react-native";

import { call, fork, put, select, take } from "redux-saga/effects";

import firebase from "../api/firebase";

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
export const tryEveryIfInternetConnected = (
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
        try {
          yield fork(saga, action);
        } catch (e) {
          firebase
            .crash()
            .log(`Error executing saga "${pattern}": ${e.toString()}`);
        }
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
