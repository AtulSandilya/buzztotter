import { takeEvery, takeLatest } from 'redux-saga';
import { fork } from 'redux-saga/effects';

import { fetchUser, fetchContacts, fetchAllFacebookData } from './facebook';

// Like combine reducers
export default function* rootSaga() {
  yield fork(takeEvery, 'USER_FETCH_REQUESTED', fetchUser);
  yield fork(takeEvery, 'CONTACTS_FETCH_REQUESTED', fetchContacts);
  yield fork(takeEvery, 'ALL_FACEBOOK_DATA_FETCH_REQUESTED', fetchAllFacebookData);
}
