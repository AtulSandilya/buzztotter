import {call, put, select} from "redux-saga/effects";

import {
  addNotificationToNotificationQueue,
  getFcmToken,
  isUserLoggedIn,
  setFcmToken,
  updateFirebaseUser,
} from "../api/firebase";

import theme from "../theme";

import {
  Notification,
  NotificationActions,
} from "../db/tables";
import {User} from "../db/tables";

export function *sendReceivedNotification(action, receiverFacebookId: string) {
  const receiverFcmToken: string = yield call(getFcmToken, receiverFacebookId);

  const userState: UserState = yield select<{user: UserState}>((state) => state.user);
  const sender = userState.fullName;
  const quantity: number = action.payload.sendBevegramData.quantity;
  const bevStr = "bevegram" + (quantity !== 1 ? "s" : "");

  const notification: Notification = {
    action: NotificationActions.ShowNewReceivedBevegrams,
    body: `${sender} sent you ${quantity} ${bevStr}`,
    // Shorthand syntax, can be accessed with data.quantity
    data: { quantity },
    icon: theme.notificationIcons.beverage,
    receiverGCMId: receiverFcmToken,
    title: `You received ${quantity} ${bevStr}`,
  };

  yield call(addNotificationToNotificationQueue, notification);

}

export function *storeFcmToken(action) {
  yield put({type: "STORE_FCM_TOKEN", payload: {
    fcmToken: action.payload.fcmToken,
  }});
}

export function *dbWriteFcmToken() {
  const userState: UserState = yield select<{user: UserState}>((state) => state.user);
  yield call(setFcmToken, userState.facebook.id, userState.fcmToken);
  yield call(updateFirebaseUser, userState);
}
