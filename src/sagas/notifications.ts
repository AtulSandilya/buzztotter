import { delay } from "redux-saga";
import { call, put, select } from "redux-saga/effects";

import FCM, { FCMEvent } from "react-native-fcm";

import { NotificationActions, User } from "../db/tables";
import { Settings } from "../reducers/settings";
import { sceneKeys, sceneOrder } from "../reducers/view";

import store from "../configureStore";

import * as queue from "./queue";

let notificationListener;
let refreshTokenListener;

export function* startListener() {
  const currentNotificationSetting = yield select<{ settings: Settings }>(
    state => state.settings.notifications,
  );
  const user: User = yield select<{ user: User }>(state => state.user);

  const shouldTurnOnListener =
    currentNotificationSetting &&
    (user && user.firebase) &&
    notificationListener === undefined;

  if (shouldTurnOnListener) {
    FCM.requestPermissions();

    FCM.getFCMToken().then(token => {
      if (token) {
        store.dispatch({
          payload: { fcmToken: token },
          type: "STORE_FCM_TOKEN",
        });
      }

      const shouldSaveTokenToDb =
        token !== undefined &&
        user !== undefined &&
        user.isLoggedIn &&
        user.fcmToken !== undefined;

      if (shouldSaveTokenToDb) {
        store.dispatch({ type: "SAVE_FCM_TOKEN", payload: token });
        store.dispatch({ type: "UPDATE_USER" });
      }
    });

    notificationListener = FCM.on(
      FCMEvent.Notification,
      (notifPayload: any) => {
        // Because this is a callback, no generators are allowed. The workaround
        // is to call `store.dispatch` directly to call other methods through
        // sagas. Another option is to use `redux-saga` channels, but adds more
        // complexity for a questionable gain

        // There are 3 notification situations to handle here
        // 1. App is in the foreground
        // 2. App is in the background and notification clicked
        // (payload.opened_from_tray is 1)
        // 3. App is not running (caught in FCM.getInitialNotification)

        if (notifPayload.open_from_tray === 1) {
          store.dispatch({
            /* tslint:disable:object-literal-sort-keys */
            type: "NOTIFICATION_CLICKED_WHILE_APP_IS_CLOSED",
            payload: notifPayload,
          });
        } else {
          switch (notifPayload.action) {
            case NotificationActions.ShowNewReceivedBevegrams:
              store.dispatch({
                type: "ADD_RECEIVED_BEVEGRAM_TO_BADGE",
                payload: {
                  // Should this badge show the number of bevegrams received or
                  // quantity: payload.quantity,
                  quantity: 1,
                },
              });
              store.dispatch({ type: "FETCH_RECEIVED_BEVEGRAMS" });
              break;
            case NotificationActions.ShowUpcomingBirthdays:
              // Do other thing
              break;
          }
        }
      },
    );

    FCM.getInitialNotification().then(payload => {
      // getInitialNotification is clicking the notification when the app is
      // closed
      store.dispatch({
        type: "NOTIFICATION_CLICKED_WHILE_APP_IS_CLOSED",
        payload,
      });
    });

    refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      store.dispatch({ type: "SAVE_FCM_TOKEN", payload: token });
    });
  }
}

export function* saveFcmToken(action) {
  // It is possible for this to be called before the firebase handshake
  // process has completed, so we try to write to the queue multiple times if
  // this fails, waiting in between for firebase to setup.
  const maxAttempts = 5;
  let attempts = 0;
  while (true) {
    if (attempts > maxAttempts) {
      break;
    }
    attempts++;
    try {
      yield call(queue.turnOnNotifications, action.payload);
      break;
    } catch (e) {
      const timeoutInterval = 500;
      yield delay(timeoutInterval);
    }
  }
}

export function* onNotificationClickedWhileAppIsClosed(payload) {
  switch (payload.action) {
    case NotificationActions.ShowNewReceivedBevegrams:
      yield call(showNewReceivedBevegrams);

      yield put({ type: "FETCH_RECEIVED_BEVEGRAMS" });

      break;
    case NotificationActions.ShowUpcomingBirthdays:
      yield put({
        type: "SEND_BEVEGRAM_TO_CONTACT_VIA_NOTIFICATION",
        payload: {
          facebookId: payload.facebookId,
        },
      });
      break;
  }
}

function* showNewReceivedBevegrams() {
  yield put({
    type: "GO_TO_ROUTE",
    payload: {
      route: "MainUi",
    },
  });
  yield put({
    type: "GOTO_VIEW",
    newScene: sceneOrder[sceneKeys.bevegrams],
  });

  yield put({ type: "RESET_BADGE_ON_NEXT_CLICK" });
}

export function* stopListener() {
  // This is called when the MainView is unmounted and if the user is already
  // logged out this will fail, so we check the users logged in status before
  // continuing
  const user: User = yield select<{ user: User }>(state => state.user);
  if (user.firebase && user.isLoggedIn) {
    yield call(queue.turnOffNotifications);
  }

  if (notificationListener) {
    notificationListener.remove();
  }
  if (refreshTokenListener) {
    refreshTokenListener.remove();
  }
}
