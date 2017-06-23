import { Alert } from "react-native";

import { delay } from "redux-saga";
import { call, put, race, select } from "redux-saga/effects";

import FirebaseDb from "../api/firebase/FirebaseDb";
import { FirebaseUser, User } from "../db/tables";

import {
  AddCreditCardToCustomerPackageForQueue,
  EventStatus,
  PurchasePackageForQueue,
  RedeemPackageForQueue,
  RemoveCreditCardFromCustomerPackageForQueue,
  TransactionStatus,
} from "../db/tables";

import { StringifyDate } from "../CommonUtilities";

import {
  firebaseLoginViaFacebookToken,
  firebaseLogOut as apiFirebaseLogOut,
  getFirebaseId,
  getFirebaseUser,
  getPurchasePackages,
  initializeFirebaseUserFacebookId,
  isUserLoggedIn,
  OnNextPurchaseTransactionStatusChange,
  OnNextUrlNodeChange,
  OnNextUserNodeChange,
  QueueAddCreditCardToCustomerPackage,
  readNode,
  readPurchasedBevegrams,
  readReceivedBevegrams,
  readRedeemedBevegrams,
  readSentBevegrams,
  updateFirebaseUser as apiUpdateFirebaseUser,
} from "../api/firebase";

import * as DbSchema from "../db/schema";

//  Login / Logout ------------------------------------------------------{{{

/* tslint:disable:object-literal-sort-keys */
export function* firebaseFacebookLogin(action) {
  try {
    yield put({ type: "ATTEMPING_FIREBASE_LOGIN" });
    const firebaseCredential = yield call(
      firebaseLoginViaFacebookToken,
      action.payload.token,
    );

    const firebaseUser: FirebaseUser = {
      displayName: firebaseCredential.displayName,
      email: firebaseCredential.email,
      emailVerified: firebaseCredential.emailVerified,
      photoURL: firebaseCredential.photoURL,
      refreshToken: firebaseCredential.refreshToken,
      uid: firebaseCredential.uid,
    };

    const facebookId = yield select<any>(state => state.user.facebook.id);
    yield call(initializeFirebaseUserFacebookId, firebaseUser.uid, facebookId);

    yield put({
      type: "SUCCESSFUL_FIREBASE_LOGIN",
      payload: {
        firebaseUser: firebaseUser,
      },
    });

    yield call(updateFirebaseUser, {});
  } catch (e) {
    yield put({ type: "FAILED_FIREBASE_LOGIN" });
  }
}

export function* firebaseLogOut(action) {
  try {
    yield put({ type: "ATTEMPTING_FIREBASE_LOGOUT" });
    yield call(apiFirebaseLogOut);
    yield put({ type: "SUCCESSFUL_FIREBASE_LOGOUT" });
  } catch (e) {
    yield put({ type: "FAILED_FIREBASE_LOGOUT" });
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

export function* verifyReceiverExists(action) {
  const receiverFacebookId = action.payload.sendBevegramData.facebookId;
  let receiverFirebaseId: string;
  try {
    receiverFirebaseId = yield call(getFirebaseId, receiverFacebookId);
    if (!receiverFirebaseId) {
      throw Error;
    }
    return receiverFirebaseId;
  } catch (e) {
    alert(
      `Unable to send Bevegram! ${action.payload.sendBevegramData
        .recipentName} does not exist in our records.`,
    );
    throw Error(
      `getFirebaseId for receiver "${receiverFacebookId}" does not exist!`,
    );
  }
}

//  End Utilities -------------------------------------------------------}}}
//  User ----------------------------------------------------------------{{{

export function* updateFirebaseUser(action) {
  yield put({
    type: "UPDATE_LAST_MODIFIED",
    payload: {
      lastModified: StringifyDate(),
    },
  });

  let user: User = yield select<{ user: User }>(state => state.user);

  const userInDb: User = user && user.firebase
    ? yield call(getFirebaseUser, user.firebase.uid)
    : undefined;
  if (userInDb && userInDb.stripe) {
    user = {
      ...userInDb,
      ...user,
      stripe: userInDb.stripe,
    };
  } else if (userInDb) {
    user = { ...userInDb, ...user };
  }

  try {
    yield put({ type: "ATTEMPTING_FIREBASE_UPDATE_USER" });

    yield call(apiUpdateFirebaseUser, user);

    yield put({ type: "SUCCESSFUL_FIREBASE_UPDATE_USER" });
  } catch (e) {
    yield put({
      type: "FAILED_FIREBASE_UPDATE_USER",
      payload: {
        error: e,
      },
    });
  }
}

export function* getUser() {
  const user: User = yield select<{ user: User }>(state => state.user);
  if (user && user.firebase) {
    const updatedUser: User = yield call(getFirebaseUser, user.firebase.uid);
    yield put({
      type: "REWRITE_USER",
      payload: {
        updatedUser,
      },
    });
  }
}

export function* updatePurchasePackages() {
  const purchasePackages = yield call(getPurchasePackages);
  yield put({
    type: "UPDATE_PURCHASE_PACKAGES",
    payload: {
      purchasePackages,
    },
  });
}

export function* updateReceivedBevegrams() {
  const userFirebaseId = yield select<{ user: User }>(
    state => state.user.firebase.uid,
  );
  const result = yield call(readReceivedBevegrams, userFirebaseId);
  return result;
}

//  End User ------------------------------------------------------------}}}

//  Update History ------------------------------------------------------{{{

export function* updateHistory() {
  yield put({ type: "ATTEMPTING_HISTORY_UPDATE" });
  try {
    const user: User = yield select<{ user: User }>(state => state.user);
    const userFirebaseId: string = user.firebase.uid;

    const purchasedList = yield call(readPurchasedBevegrams, userFirebaseId);
    const sentList = yield call(readSentBevegrams, userFirebaseId);
    const receivedList = yield call(readReceivedBevegrams, userFirebaseId);
    const redeemedList = yield call(readRedeemedBevegrams, userFirebaseId);

    // In theory doing a lot of puts at the same time should update the state
    // only once.
    yield put({
      type: "SET_PURCHASED_BEVEGRAM_LIST",
      payload: { list: purchasedList ? purchasedList : {} },
    });
    yield put({
      type: "SET_SENT_BEVEGRAM_LIST",
      payload: { list: sentList ? sentList : {} },
    });
    yield put({
      type: "SET_RECEIVED_BEVEGRAM_LIST",
      payload: { list: receivedList ? receivedList : {} },
    });
    yield put({
      type: "SET_REDEEMED_BEVEGRAM_LIST",
      payload: { list: redeemedList ? redeemedList : {} },
    });
  } catch (e) {
    console.warn(e);
  }

  yield put({ type: "SUCCESSFUL_HISTORY_UPDATE" });
}

//  End Update History --------------------------------------------------}}}

interface ListenForChange {
  timeout: any;
  changedNode: any;
}

function* listenForChangeOnUrl(url: string): IterableIterator<ListenForChange> {
  const serverTimeout = 5000;

  // timeout will not be undefined on a server timeout
  const serverResponse = yield race({
    timeout: call(delay, serverTimeout),
    changedNode: call(OnNextUrlNodeChange, url),
  }) as any;

  if (serverResponse.timeout) {
    // Make a list ditch effort to get the server status
    // If the status indicates completion or failure return the completed
    // status
    const status = yield call(readNode, url) as any;
    if (transactionFinished(status)) {
      return {
        changedNode: status,
        timeout: undefined,
      };
    }
  }
  return serverResponse;
}

export function* updateUserStateOnNextChange(
  onSuccessPostActions?: string[],
  onFailurePostActions?: string[],
  errorKey?: string,
  showAlert?: boolean,
) {
  const user: User = yield select<{ user: User }>(state => state.user);
  const userFirebaseId: string = user.firebase.uid;

  const url = DbSchema.GetUserDbUrl(userFirebaseId);
  const serverResponse: ListenForChange = yield call(listenForChangeOnUrl, url);
  const updatedUser = serverResponse.changedNode;

  let errorMessage;

  if (updatedUser) {
    yield put({
      type: "REWRITE_USER",
      payload: {
        updatedUser,
      },
    });
  } else {
    // Timeout!
    errorMessage = "Unable to communicate with our servers!";
  }

  if (errorKey && !errorMessage) {
    errorMessage = { ...updatedUser };
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

    postActions = onFailurePostActions.map(val => {
      return {
        type: val,
        payload: {
          error: errorMessage,
        },
      };
    });
  } else {
    postActions = onSuccessPostActions.map(val => {
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

function* handleNextPurchaseTransactionStatusChange(): object {
  const user: User = yield select<{ user: User }>(state => state.user);
  const userFirebaseId: string = user.firebase.uid;
  const url = DbSchema.GetPurchaseTransactionStatusDbUrl(userFirebaseId);
  const purchaseTransactionStatus: ListenForChange = yield call(
    listenForChangeOnUrl,
    url,
  );

  if (purchaseTransactionStatus.timeout) {
    yield put({
      type: "FAILED_PURCHASE_TRANSACTION",
      payload: {
        error: "Server Timeout",
      },
    });
    return;
  } else {
    yield put({
      type: "UPDATE_PURCHASE_TRANSACTION_STATUS",
      payload: {
        purchaseTransactionStatus: purchaseTransactionStatus.changedNode,
      },
    });
    return purchaseTransactionStatus.changedNode;
  }
}

function* handleNextRedeemTransactionStatusChange(): object {
  const user: User = yield select<{ user: User }>(state => state.user);
  const userFirebaseId: string = user.firebase.uid;
  const url = DbSchema.GetRedeemTransactionStatusDbUrl(userFirebaseId);
  const redeemTransactionStatus: ListenForChange = yield call(
    listenForChangeOnUrl,
    url,
  );

  if (redeemTransactionStatus.timeout) {
    yield put({
      type: "FAILED_REDEEM_TRANSACTION",
      payload: {
        error: "Server Timeout",
      },
    });
    return;
  } else {
    yield put({
      type: "UPDATE_REDEEM_TRANSACTION_STATUS",
      payload: {
        redeemTransactionStatus: redeemTransactionStatus.changedNode,
      },
    });
    return redeemTransactionStatus.changedNode;
  }
}

export const transactionFailed = <T>(transaction: T): boolean => {
  for (const key of Object.keys(transaction)) {
    if (transaction[key] === "failed") {
      return true;
    } else if (key === "error" && transaction[key] !== undefined) {
      return true;
    }
  }
  return false;
};

const transactionComplete = <T>(transaction: T): boolean => {
  for (const key of Object.keys(transaction)) {
    if (key !== "lastModified" && transaction[key] !== "complete") {
      return false;
    }
  }
  return true;
};

export const transactionFinished = <T extends TransactionStatus>(
  transaction: T,
): boolean => {
  return (
    transactionFailed<T>(transaction) ||
    transactionComplete<T>(transaction) ||
    transaction.error !== undefined
  );
};

function* listenUntilTransactionSuccessOrFailure(transactionFunction) {
  while (true) {
    const transactionResult: { [name: string]: EventStatus } = yield call(
      transactionFunction,
    );
    if (
      !transactionResult ||
      transactionComplete(transactionResult) ||
      transactionFailed(transactionResult)
    ) {
      break;
    }
  }
}

export function* listenUntilPurchaseSuccessOrFailure() {
  yield call(
    listenUntilTransactionSuccessOrFailure,
    handleNextPurchaseTransactionStatusChange,
  );
}

export function* listenUntilRedeemSuccessOrFailure() {
  yield call(
    listenUntilTransactionSuccessOrFailure,
    handleNextRedeemTransactionStatusChange,
  );
}
