import { takeEvery, takeLatest } from 'redux-saga';
import { call, fork } from 'redux-saga/effects';

import {ActionConst} from 'react-native-router-flux';

import { fetchUser, fetchContacts, fetchAllFacebookData, reloadContacts } from './facebook';

import {
  fetchCreditCardPurchase,
  fetchDeleteCustomerCard,
  fetchUpdateDefaultCard,
  fetchVerifyCreditCard,
} from './stripe';

import {
  goBackRoute,
  goToRoute,
  onFocusRoute,
} from './routes';

import {
  sendBevegram,
} from './sendBevegram';

// Like combine reducers
export default function* rootSaga() {
  // Facebook
  yield fork(takeEvery, 'USER_FETCH_REQUESTED', fetchUser);
  yield fork(takeEvery, 'CONTACTS_FETCH_REQUESTED', fetchContacts);
  yield fork(takeEvery, 'FACEBOOK_CONTACTS_RELOAD_REQUEST', reloadContacts);
  yield fork(takeEvery, 'ALL_FACEBOOK_DATA_FETCH_REQUESTED', fetchAllFacebookData);

  // Stripe
  yield fork(takeEvery, 'REQUEST_CREDIT_CARD_VERIFICATION', fetchVerifyCreditCard);
  yield fork(takeEvery, 'REQUEST_CREDIT_CARD_PURCHASE', fetchCreditCardPurchase);
  yield fork(takeEvery, 'REQUEST_UPDATE_DEFAULT_CARD', fetchUpdateDefaultCard);
  yield fork(takeEvery, 'REQUEST_REMOVE_CARD', fetchDeleteCustomerCard);

  // Sending Bevegrams
  yield fork(takeEvery, 'SEND_BEVEGRAM', sendBevegram);

  // Purchasing Then Sending
  yield fork(takeEvery, 'PURCHASE_THEN_SEND_BEVEGRAM', function *(action) {
    yield call(fetchCreditCardPurchase, action);
    yield call(sendBevegram, action);
  });

  // Routes
  yield fork(takeEvery, 'GO_TO_ROUTE', goToRoute);
  yield fork(takeEvery, 'GO_BACK_ROUTE', goBackRoute);
  // Dispatch actions based on router events
  yield fork(takeEvery, ActionConst.FOCUS, onFocusRoute);
}
