import { takeEvery, takeLatest } from 'redux-saga';
import { fork } from 'redux-saga/effects';

import {ActionConst} from 'react-native-router-flux';

import { fetchUser, fetchContacts, fetchAllFacebookData, reloadContacts } from './facebook';

import {
  fetchCreditCardPurchase,
  fetchDeleteCustomerCard,
  fetchUpdateDefaultCard,
  fetchVerifyCreditCard,
} from './stripe';
import { goToRoute, goBackRoute } from './routes';

import {handleFocus} from './router-flux';

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

  // Routes
  yield fork(takeEvery, 'GO_TO_ROUTE', goToRoute);
  yield fork(takeEvery, 'GO_BACK_ROUTE', goBackRoute);

  // react-native-router-flux
  // Dispatch actions based on router events
  yield fork(takeEvery, ActionConst.FOCUS, handleFocus);
}
