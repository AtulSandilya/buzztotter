import {call, put, select} from "redux-saga/effects";

import {
  isUserLoggedIn,
  getFcmToken,
  setFcmToken,
  updateFirebaseUser,
} from '../api/firebase';

import theme from '../theme';
import {UserState} from '../reducers/user';
import { Notification, NotificationActions, sendNotification } from '../api/notifications';

export function *sendReceivedNotification(action, receiverFacebookId: string) {
  const receiverFcmToken: string = yield call(getFcmToken, receiverFacebookId);

  const userState: UserState = yield select<{user: UserState}>((state) => state.user);
  const sender = userState.fullName;
  const quantity: number = action.payload.sendBevegramData.quantity;
  const bevStr = "bevegram" + (quantity !== 1 ? "s" : "");

  const notifResult = yield call(sendNotification, receiverFcmToken, {
    title: `You received ${quantity} ${bevStr}`,
    body: `${sender} sent you ${quantity} ${bevStr}`,
    icon: theme.notificationIcons.beverage,
    action: NotificationActions.ShowNewReceivedBevegrams,
  }, {
    quantity: quantity,
  })

}

export function *storeFcmToken(action) {
  yield put({type: 'STORE_FCM_TOKEN', payload: {
    fcmToken: action.payload.fcmToken
  }})

  const userState: UserState = yield select<{user: UserState}>((state) => state.user);
  if(isUserLoggedIn()) {
    yield call(setFcmToken, userState.facebook.id, userState.fcmToken);
    yield call(updateFirebaseUser, userState);
  }
}
