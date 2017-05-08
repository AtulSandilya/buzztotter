import {call, put, select} from "redux-saga/effects";

import {User} from "../db/tables";

import {
  setFcmToken,
  updateFirebaseUser,
} from "../api/firebase";

export function *storeFcmToken(action) {
  yield put({type: "STORE_FCM_TOKEN", payload: {
    fcmToken: action.payload.fcmToken,
  }});
}

export function *dbWriteFcmToken() {
  const userState: User = yield select<{user: User}>((state) => state.user);
  yield call(setFcmToken, userState.facebook.id, userState.fcmToken);
  yield call(updateFirebaseUser, userState);
}
