import { takeEvery, takeLatest } from 'redux-saga';
import { fork } from 'redux-saga/effects';

import { fetchUser, fetchContacts, fetchAllFacebookData, reloadContacts } from './facebook';
import { fetchCreditCardToken } from './stripe';

// Like combine reducers
export default function* rootSaga() {
  yield fork(takeEvery, 'USER_FETCH_REQUESTED', fetchUser);
  yield fork(takeEvery, 'CONTACTS_FETCH_REQUESTED', fetchContacts);
  yield fork(takeEvery, 'FACEBOOK_CONTACTS_RELOAD_REQUEST', reloadContacts);
  yield fork(takeEvery, 'ALL_FACEBOOK_DATA_FETCH_REQUESTED', fetchAllFacebookData);
  yield fork(takeEvery, 'REQUEST_CREDIT_CARD_TOKEN', fetchCreditCardToken);
}
