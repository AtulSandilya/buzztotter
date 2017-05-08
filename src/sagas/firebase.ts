import {Alert} from "react-native";

import { delay } from "redux-saga";
import { call, put, race, select } from "redux-saga/effects";

import FirebaseDb from "../api/firebase/FirebaseDb";
import {FirebaseUser, User} from "../db/tables";

import {
  AddCreditCardToCustomerPackageForQueue,
  PurchasePackageForQueue,
  RedeemPackageForQueue,
  RemoveCreditCardFromCustomerPackageForQueue,
} from "../db/tables";

import {StringifyDate} from "../CommonUtilities";

import {
  firebaseLoginViaFacebookToken,
  firebaseLogOut as apiFirebaseLogOut,
  getFirebaseId,
  getFirebaseUser,
  getPurchasePackages,
  initializeFirebaseUserFacebookId,
  isUserLoggedIn,
  OnNextPurchaseTransactionStatusChange,
  OnNextUserNodeChange,
  QueueAddCreditCardToCustomerPackage,
  readPurchasedBevegrams,
  readReceivedBevegrams,
  readRedeemedBevegrams,
  readSentBevegrams,
  updateFirebaseUser as apiUpdateFirebaseUser,
} from "../api/firebase";

//  Login / Logout ------------------------------------------------------{{{

export function *firebaseFacebookLogin(action) {
  try {
    yield put({type: "ATTEMPING_FIREBASE_LOGIN"});
    const firebaseCredential = yield call(firebaseLoginViaFacebookToken, action.payload.token);

    const firebaseUser: FirebaseUser = Object.assign({}, {
      displayName: firebaseCredential.displayName,
      email: firebaseCredential.email,
      emailVerified: firebaseCredential.emailVerified,
      photoURL: firebaseCredential.photoURL,
      refreshToken: firebaseCredential.refreshToken,
      uid: firebaseCredential.uid,
    });

    const facebookId = yield select<any>((state) => state.user.facebook.id);
    yield call(initializeFirebaseUserFacebookId, firebaseUser.uid, facebookId);

    yield put({type: "SUCCESSFUL_FIREBASE_LOGIN", payload: {
      firebaseUser: firebaseUser,
    }});

    yield call(updateFirebaseUser);

  } catch (e) {
    yield put({type: "FAILED_FIREBASE_LOGIN"});
  }
}

export function *firebaseLogOut(action) {
  try {
    yield put({type: "ATTEMPTING_FIREBASE_LOGOUT"});
    yield call(apiFirebaseLogOut);
    yield put({type: "SUCCESSFUL_FIREBASE_LOGOUT"});
  } catch (e) {
    yield put({type: "FAILED_FIREBASE_LOGOUT"});
  }
}

// Either here or within the api a check to test if a user is logged into
// firebase must be performed. If a user is not logged into firebase any db
// requests are rejected with a permission denied error.
// function *reloginUserIfNecessary() {
//   if(!isUserLoggedIn()){
//     Alert.alert(
//       "Login Error",
//       "You have been logged out, please relogin.",
//       {
//         text: "Relogin",
//         onPress: () => {
//           console.log("Re logging in");
//           yield put({type: ""})
//         }
//       },
//       {
//         text: "Cancel",
//         onPress: () => {
//           console.log("Cancel");
//         }
//       }
//     )
//     return true;
//   }

//   return false;
// }

//  End Login / Logout --------------------------------------------------}}}
//  Utilities -----------------------------------------------------------{{{

export function *verifyReceiverExists(action) {
  const receiverFacebookId = action.payload.sendBevegramData.facebookId;
  let receiverFirebaseId: string;
  try {
    receiverFirebaseId = yield call(getFirebaseId, receiverFacebookId);
    if (!receiverFirebaseId) { throw Error; }
    return receiverFirebaseId;
  } catch (e) {
    alert(`Unable to send Bevegram! ${action.payload.sendBevegramData.recipentName} does not exist in our records.`);
    throw Error(`getFirebaseId for receiver "${receiverFacebookId}" does not exist!`);
  }
}

//  End Utilities -------------------------------------------------------}}}
//  User ----------------------------------------------------------------{{{

export function *updateFirebaseUser(action) {
  yield put({type: "UPDATE_LAST_MODIFIED", payload: {
    lastModified: StringifyDate(),
  }});

  const user: User = yield select<{user: User}>((state) => state.user);
  const userInDb: User = FirebaseDb.SanitizeDbInput(yield call(getFirebaseUser, user.firebase.uid));
  const mergedUser = Object.assign({}, userInDb, user, {
    stripe: userInDb.stripe,
  });

  try {
    yield put({type: "ATTEMPTING_FIREBASE_UPDATE_USER"});

    yield call(apiUpdateFirebaseUser, mergedUser);

    yield put({type: "SUCCESSFUL_FIREBASE_UPDATE_USER"});
  } catch (e) {
    yield put({type: "FAILED_FIREBASE_UPDATE_USER", payload: {
      error: e,
    }});
  }
}

export function * getUser(){
  const user: User = yield select<{user: User}>((state) => state.user);
  const updatedUser: User = yield call(getFirebaseUser, user.firebase.uid);
  yield put({type: "REWRITE_USER", payload: {
    updatedUser,
  }});
}

export function *updatePurchasePackages() {
  const purchasePackages = yield call(getPurchasePackages);
  yield put ({type: "UPDATE_PURCHASE_PACKAGES", payload: {
    purchasePackages,
  }});
}

//  End User ------------------------------------------------------------}}}

export function *updateAllLists() {
  const user: User = yield select<{user: User}>((state) => state.user);
  const userFirebaseId: string = user.firebase.uid;

  const purchasedList = yield call(readPurchasedBevegrams, userFirebaseId);
  const sentList = yield call(readSentBevegrams, userFirebaseId);
  const receivedList = yield call(readReceivedBevegrams, userFirebaseId);
  const redeemedList = yield call(readRedeemedBevegrams, userFirebaseId);

  // In theory doing a lot of puts at the same time should update the state
  // only once.
  yield put({type: "SET_PURCHASED_BEVEGRAM_LIST", payload: {list: purchasedList}});
  yield put({type: "SET_SENT_BEVEGRAM_LIST", payload: {list: sentList}});
  yield put({type: "SET_RECEIVED_BEVEGRAM_LIST", payload: {list: receivedList}});
  yield put({type: "SET_REDEEMED_BEVEGRAM_LIST", payload: {list: redeemedList}});
}

export function *updateUserStateOnNextChange(
  onSuccessPostActions?: string[],
  onFailurePostActions?: string[],
  errorKey?: string,
  showAlert?: boolean,
) {
  const user: User = yield select<{user: User}>((state) => state.user);
  const userFirebaseId: string = user.firebase.uid;
  const serverTimeout = 15000;

  let errorMessage;

  const {updatedUser, timeout} = yield race({
    timeout: call(delay, serverTimeout),
    updatedUser: call(OnNextUserNodeChange, userFirebaseId),
  });

  if (updatedUser) {
    yield put({type: "REWRITE_USER", payload: {
      updatedUser,
    }});
  } else {
    errorMessage = "Unable to communicate with our servers!";
  }

  if (errorKey && !errorMessage) {
    errorMessage = Object.assign({}, updatedUser);
    try {
      errorMessage = errorMessage[errorKey];
    } catch (e) {
      // continue
    }
  }

  let postActions;
  if (errorMessage) {
    if (showAlert) {
      alert(errorMessage);
    }

    postActions = onFailurePostActions.map((val) => {
      return {
        type: val,
        payload: {
          error: errorMessage,
        },
      };
    });
  }  else {
    postActions = onSuccessPostActions.map((val) => {
      return {
        type: val,
      };
    });
  }

  if (postActions) {
    for (const action of postActions) {
      yield put(action);
    }
  }
}

export function *handleNextPurchaseTransactionStatusChange() {
  const user: User = yield select<{user: User}>((state) => state.user);
  const userFirebaseId: string = user.firebase.uid;
  const serverTimeout = 25000;

  const {purchaseTransactionStatus, timeout} = yield race({
    purchaseTransactionStatus: call(OnNextPurchaseTransactionStatusChange, userFirebaseId),
    timeout: call(delay, serverTimeout),
  });

  if (timeout) {
    yield put({type: "FAILED_PURCHASE_TRANSACTION", payload: {
      error: "Server Timeout",
    }});
  } else {
    yield put({type: "UPDATE_PURCHASE_TRANSACTION_STATUS", payload: {
      purchaseTransactionStatus,
    }});
  }

}
