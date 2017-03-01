import {
  call,
  fork,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import {ActionConst} from 'react-native-router-flux';

import {
  fetchAllFacebookData,
  fetchContacts,
  fetchUser,
  logOutFacebook,
  reloadContacts,
  successfulLogin,
} from './facebook';

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
  addPurchasedBevegramToDB,
  addReceivedBevegramToDB,
  addRedeemedBevegramToDB,
  addSentBevegramToDB,
  firebaseFacebookLogin,
  firebaseLogOut,
  updateFirebaseUser,
  updateReceivedBevegrams,
  verifyReceiverExists,
} from './firebase';

import {
  sendReceivedNotification,
  storeFcmToken,
} from './notifications';

// Like combine reducers
export default function* rootSaga() {
  // Facebook
  yield fork(takeEvery, 'USER_FETCH_REQUESTED', fetchUser);
  yield fork(takeEvery, 'CONTACTS_FETCH_REQUESTED', fetchContacts);
  yield fork(takeEvery, 'FACEBOOK_CONTACTS_RELOAD_REQUEST', reloadContacts);

  // Logging In
  yield fork(takeEvery, 'SUCCESSFUL_FACEBOOK_LOGIN', successfulLogin);
  yield fork(takeEvery, 'INITIALIZE_USER_DATA_WITH_FACEBOOK_TOKEN', function *(action) {
    // Facebook user info is required to properly initialize a firebase user
    yield call(fetchUser, action);
    yield call(firebaseFacebookLogin, action);
    yield call(fetchContacts, action);
  });

  // Logging Out
  yield fork(takeEvery, 'REQUEST_LOGOUT', function *(action) {
    yield call(logOutFacebook);
    yield call(goToRoute, action);
    yield call(firebaseLogOut, action);
  })

  // Handling credit cards
  yield fork(takeEvery, 'REQUEST_CREDIT_CARD_VERIFICATION', fetchVerifyCreditCard);
  yield fork(takeEvery, 'REQUEST_UPDATE_DEFAULT_CARD', fetchUpdateDefaultCard);
  yield fork(takeEvery, 'REQUEST_REMOVE_CARD', fetchDeleteCustomerCard);

  // Purchasing Bevegrams
  function *purchaseBevegram(action){
    console.log("Purchase bevegram");
    yield call(goToRoute, action);
    const chargeId = yield call(fetchCreditCardPurchase, action);

    const purchasedBevegramPack = yield call(addPurchasedBevegramToDB, action, chargeId);
    yield put({type: "ADD_PURCHASED_BEVEGRAM", payload: {
      purchasedBevegramPack: purchasedBevegramPack,
    }})
    return purchasedBevegramPack.id;
  }

  yield fork(takeEvery, 'PURCHASE_BEVEGRAM', function *(action) {
    yield call(purchaseBevegram, action);
  });

  // Sending Bevegrams
  function *sendBevegram(action, receiverFirebaseId, purchaseId) {
    console.log("sendBevegram");
    yield put({type: 'ATTEMPTING_SEND_BEVEGRAM'});
    console.log("after attempt");
    yield call(goToRoute, action);
    console.log("after goToRoute");
    const sentBevegramPack = yield call(addSentBevegramToDB, action, purchaseId);
    console.log("sentBevegramPack: ", sentBevegramPack);
    yield call(addReceivedBevegramToDB, action, receiverFirebaseId);

    yield put({type: 'ADD_SENT_BEVEGRAM', payload: {
      sentBevegramPack: sentBevegramPack,
    }})
    yield put({type: 'REMOVE_SENT_BEVEGRAM_FROM_PURCHASED', payload: {
      sentBevegramPack: sentBevegramPack,
    }})

    yield call(sendReceivedNotification, action, action.payload.sendBevegramData.facebookId);

    yield put({type: 'COMPLETED_SEND_BEVEGRAM'});
    return sentBevegramPack.id;
  }

  yield fork(takeEvery, 'SEND_BEVEGRAM', function *(action){
    try {
      // Abort sending if the reciever does not have a firebase id
      const receiverFirebaseId = yield call(verifyReceiverExists, action);
      yield call(sendBevegram, action);
    } catch (e) {
      yield put({type: 'FAILED_SEND_BEVEGRAM', payload: {
        error: e,
      }})
    }
  });

  // Purchasing Then Sending
  yield fork(takeEvery, 'PURCHASE_THEN_SEND_BEVEGRAM', function *(action) {
    try {
      // Don't allow purchasing or sending if the reciever is not in the
      // database.
      console.log("Purchase then send bevegram");
      const receiverFirebaseId = yield call(verifyReceiverExists, action);
      const purchasedBevegramId = yield call(purchaseBevegram, action);
      yield call(sendBevegram, action, receiverFirebaseId, purchasedBevegramId);
    } catch(e) {
      console.log("failed purchase and send:", e);
      yield put({type: 'FAILED_PURCHASE_AND_SEND_BEVEGRAM', payload: {
        error: e,
      }})
    }
  });

  // Receive Bevegrams
  yield fork(takeEvery, 'FETCH_RECEIVED_BEVEGRAMS', function *(action){
    yield put({type: 'ATTEMPTING_UPDATE_RECEIVED_BEVEGRAMS'});
    const receivedBevegrams = yield call(updateReceivedBevegrams);
    yield put({type: 'UPDATE_RECEIVED_BEVEGRAMS', payload: {
      receivedBevegrams: receivedBevegrams,
    }})
    yield put({type: 'SUCCESSFUL_UPDATE_RECEIVED_BEVEGRAMS'});
  })

  // Redeem Bevegram
  yield fork(takeEvery, 'REDEEM_BEVEGRAM', function *(action){
    const redeemedBevegramPack = yield call(addRedeemedBevegramToDB, action);

    yield put({type: "ADD_REDEEMED_BEVEGRAMS", payload: {
      redeemedBevegramPack: redeemedBevegramPack,
    }})
  })

  // Routes
  yield fork(takeEvery, 'GO_TO_ROUTE', goToRoute);
  yield fork(takeEvery, 'GO_BACK_ROUTE', goBackRoute);
  // Dispatch actions based on router events
  yield fork(takeEvery, ActionConst.FOCUS, onFocusRoute);

  // Notifications
  yield fork(takeEvery, 'UPDATE_FCM_TOKEN', storeFcmToken);
}
