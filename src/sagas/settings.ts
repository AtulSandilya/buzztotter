import { call, put, select } from "redux-saga/effects";

import { Settings, settingsKeys } from "../reducers/settings";
import * as notifications from "./notifications";

export function* toggleNotificationSetting() {
  const currentNotificationSetting = yield select<{ settings: Settings }>(
    state => state.settings.notifications,
  );

  yield put({ type: "TOGGLE_SETTING", settingKey: settingsKeys.notifications });

  if (currentNotificationSetting) {
    yield call(notifications.stopListener);
  } else {
    yield call(notifications.startListener);
  }
}
