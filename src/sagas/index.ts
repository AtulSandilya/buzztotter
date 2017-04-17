import {
  call,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";

import {ActionConst} from "react-native-router-flux";

import * as facebook from "./facebook";

import {
  fetchCreditCardToken,
} from "./stripe";

import {
  goBackRoute,
  goToRoute,
  onFocusRoute,
} from "./routes";

import {
  addPromoCodeToDB,
  addPurchasedBevegramToDB,
  addReceivedBevegramToDB,
  addRedeemedBevegramToDB,
  addSentBevegramToDB,
  firebaseFacebookLogin,
  firebaseLogOut,
  getUser,
  updateAllLists,
  updateFirebaseUser,
  updateReceivedBevegrams,
  updateUserStateOnNextChange,
  verifyReceiverExists,
} from "./firebase";

import {
  dbWriteFcmToken,
  sendReceivedNotification,
  storeFcmToken,
} from "./notifications";

import * as Util from "../Utilities";
import * as queue from "./queue";

import {User} from "../db/tables";

// Like combine reducers
/* tslint:disable:object-literal-sort-keys */
export default function* rootSaga() {
  // Facebook
  yield fork(takeEvery, "USER_FETCH_REQUESTED", facebook.fetchUser);
  yield fork(takeEvery, "CONTACTS_FETCH_REQUESTED", facebook.fetchContacts);
  yield fork(takeEvery, "FACEBOOK_CONTACTS_RELOAD_REQUEST", facebook.reloadContacts);

  // Logging In
  yield fork(takeEvery, "SUCCESSFUL_FACEBOOK_LOGIN", facebook.successfulLogin);
  yield fork(takeEvery, "INITIALIZE_USER_DATA_WITH_FACEBOOK_TOKEN", function *(action) {
    // Facebook user info is required to properly initialize a firebase user
    yield [
      yield call(facebook.fetchContacts, action),
      yield call(facebook.fetchUser, action),
    ];

    yield call(firebaseFacebookLogin, action);
    yield call(getUser);
    if (Util.isAndroid) {
      yield call(dbWriteFcmToken);
    }
  });

  // Logging Out
  yield fork(takeEvery, "REQUEST_LOGOUT", function *(action) {
    yield call(facebook.logOutFacebook);
    yield call(goToRoute, action);
    yield call(firebaseLogOut, action);
  });

  // Handling credit cards
  yield fork(takeEvery, "REQUEST_CREDIT_CARD_VERIFICATION", function *(action) {
    const cardToken = yield call(fetchCreditCardToken, action);
    if (cardToken) {
      yield call(queue.addCreditCardToCustomer, cardToken);
      yield call(
        updateUserStateOnNextChange,
        ["SUCCESSFUL_CREDIT_CARD_VERIFICATION", "GO_BACK_ROUTE"],
        ["FAILED_CREDIT_CARD_VERIFICATION"],
        "stripe.error",
      );
    }
  });

  yield fork(takeEvery, "REQUEST_UPDATE_DEFAULT_CARD", function *(action) {
    yield put({type: "ATTEMPTING_STRIPE_DEFAULT_CARD_UPDATE"});
    yield call(queue.updateDefaultCard, action);
    yield call(
      updateUserStateOnNextChange,
      ["RENDER_SUCCESSFUL_STRIPE_DEFAULT_CARD_UPDATE"],
      ["RENDER_FAILED_STRIPE_DEFAULT_CARD_UPDATE"],
      "stripe.error",
      true,
    );
  });

  yield fork(takeEvery, "REQUEST_REMOVE_CARD", function *(action) {
    yield put({type: "ATTEMPTING_STRIPE_REMOVE_CARD"});
    yield call(queue.removeCreditCardFromCustomer, action);
    yield call(
      updateUserStateOnNextChange,
      ["RENDER_SUCCESSFUL_STRIPE_REMOVE_CARD"],
      ["RENDER_FAILED_STRIPE_REMOVE_CARD"],
      "stripe.error",
      true,
    );
  });

  yield fork(takeEvery, "PURCHASE_REQUEST_UPDATE_USER", function *() {
    yield put({type: "ATTEMPTING_USER_REFRESH_FOR_PURCHASE"});
    yield call(getUser);
    yield put({type: "COMPLETED_USER_REFRESH_FOR_PURCHASE"});
  });

  // Purchasing Bevegrams
  function *purchaseBevegram(action) {
    yield call(goToRoute, action);
    const chargeId = yield call(fetchCreditCardPurchase, action);

    const purchasedBevegramPack = yield call(addPurchasedBevegramToDB, action, chargeId);
    yield put({type: "ADD_PURCHASED_BEVEGRAM", payload: {
      purchasedBevegramPack: purchasedBevegramPack,
    }});

    const promoCode = action.payload.purchaseData.promoCode;
    if (promoCode !== "") {
      yield call(addPromoCodeToDB, promoCode, action.payload.purchaseData.quantity);
    }

    return purchasedBevegramPack.id;
  }

  yield fork(takeEvery, "PURCHASE_BEVEGRAM", function *(action) {
    yield call(purchaseBevegram, action);
  });

  // Sending Bevegrams
  function *sendBevegram(action, receiverFirebaseId, purchaseId) {
    yield put({type: "ATTEMPTING_SEND_BEVEGRAM"});
    yield call(goToRoute, action);
    const sentBevegramPack = yield call(addSentBevegramToDB, action, purchaseId);
    yield call(addReceivedBevegramToDB, action, receiverFirebaseId);

    yield put({type: "ADD_SENT_BEVEGRAM", payload: {
      sentBevegramPack: sentBevegramPack,
    }});
    yield put({type: "REMOVE_SENT_BEVEGRAM_FROM_PURCHASED", payload: {
      sentBevegramPack: sentBevegramPack,
    }});

    yield call(sendReceivedNotification, action, action.payload.sendBevegramData.facebookId);

    yield put({type: "COMPLETED_SEND_BEVEGRAM"});
    return sentBevegramPack.id;
  }

  yield fork(takeEvery, "SEND_BEVEGRAM", function *(action){
    try {
      // Abort sending if the reciever does not have a firebase id
      const receiverFirebaseId = yield call(verifyReceiverExists, action);
      yield call(sendBevegram, action);
    } catch (e) {
      yield put({type: "FAILED_SEND_BEVEGRAM", payload: {
        error: e,
      }});
    }
  });

  // Purchasing Then Sending
  yield fork(takeEvery, "PURCHASE_THEN_SEND_BEVEGRAM", function *(action) {
    try {
      // Don"t allow purchasing or sending if the reciever is not in the
      // database.
      const receiverFirebaseId = yield call(verifyReceiverExists, action);
      const purchasedBevegramId = yield call(purchaseBevegram, action);
      yield call(sendBevegram, action, receiverFirebaseId, purchasedBevegramId);
    } catch (e) {
      yield put({type: "FAILED_PURCHASE_AND_SEND_BEVEGRAM", payload: {
        error: e,
      }});
    }
  });

  // Receive Bevegrams
  yield fork(takeEvery, "FETCH_RECEIVED_BEVEGRAMS", function *(action){
    yield put({type: "ATTEMPTING_UPDATE_RECEIVED_BEVEGRAMS"});
    const receivedBevegrams = yield call(updateReceivedBevegrams);
    yield put({type: "UPDATE_RECEIVED_BEVEGRAMS", payload: {
      receivedBevegrams: receivedBevegrams,
    }});
    yield put({type: "SUCCESSFUL_UPDATE_RECEIVED_BEVEGRAMS"});
  });

  // Redeem Bevegram
  yield fork(takeEvery, "REDEEM_BEVEGRAM", function *(action){
    const redeemedBevegramPack = yield call(addRedeemedBevegramToDB, action);

    yield put({type: "ADD_REDEEMED_BEVEGRAMS", payload: {
      redeemedBevegramPack: redeemedBevegramPack,
    }});
  });

  // Routes
  yield fork(takeEvery, "GO_TO_ROUTE", goToRoute);
  yield fork(takeEvery, "GO_BACK_ROUTE", goBackRoute);
  // Dispatch actions based on router events
  yield fork(takeEvery, ActionConst.FOCUS, onFocusRoute);

  // Notifications
  yield fork(takeEvery, "UPDATE_FCM_TOKEN", storeFcmToken);

  // History
  yield fork(takeEvery, "REFRESH_HISTORY", updateAllLists);
}
