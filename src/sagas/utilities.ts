import { fork, take } from "redux-saga/effects";

import firebase from "../api/firebase";

export const tryEvery = (pattern: string, saga: any) =>
  fork(function*() {
    while (true) {
      const action = yield take(pattern);

      try {
        yield fork(saga, action);
      } catch (e) {
        firebase
          .crash()
          .log(`Error executing saga "${pattern}": ${e.toString()}`);
      }
    }
  });
