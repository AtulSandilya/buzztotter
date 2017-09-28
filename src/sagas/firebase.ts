import { delay } from "redux-saga";
import { call, put, race, select, take } from "redux-saga/effects";

import { batchActions } from "redux-batched-actions";

import firebase from "../api/firebase";
import { StringifyDate } from "../CommonUtilities";
import store from "../configureStore";
import { FirebaseUser, User } from "../db/tables";
import { TransactionStatus } from "../db/tables";

import {
  firebaseLoginViaFacebookToken,
  firebaseLogOut as apiFirebaseLogOut,
  getFirebaseId,
  getFirebaseUser,
  getPurchasePackages,
  initializeFirebaseUserFacebookId,
  OnNextUrlNodeChange,
  readNode,
  readPurchasedBevegrams,
  readReceivedBevegrams,
  readRedeemedBevegrams,
  readSentBevegrams,
  StartListenerOnUrl,
  StopListenerOnUrl,
  updateFirebaseUser as apiUpdateFirebaseUser,
} from "../api/firebase";

import * as DbSchema from "../db/schema";

//  Login / Logout ------------------------------------------------------{{{

/* tslint:disable:object-literal-sort-keys */
export function* firebaseFacebookLogin(facebookAccessToken: string) {
  try {
    yield put({ type: "ATTEMPING_FIREBASE_LOGIN" });
    const firebaseCredential = yield call(
      firebaseLoginViaFacebookToken,
      facebookAccessToken,
    );

    const firebaseUser: FirebaseUser = {
      displayName: firebaseCredential.displayName,
      email: firebaseCredential.email,
      emailVerified: firebaseCredential.emailVerified,
      photoURL: firebaseCredential.photoURL,
      uid: firebaseCredential.uid,
    };

    const facebookId = yield select<any>(state => state.user.facebook.id);
    yield call(initializeFirebaseUserFacebookId, firebaseUser.uid, facebookId);

    yield put({
      type: "SUCCESSFUL_FIREBASE_LOGIN",
      payload: {
        firebaseUser,
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

  const userInDb: User =
    user && user.firebase
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

    yield put(
      batchActions([
        {
          type: "SET_PURCHASED_BEVEGRAM_LIST",
          payload: { list: purchasedList ? purchasedList : {} },
        },
        {
          type: "SET_SENT_BEVEGRAM_LIST",
          payload: { list: sentList ? sentList : {} },
        },
        {
          type: "SET_RECEIVED_BEVEGRAM_LIST",
          payload: { list: receivedList ? receivedList : {} },
        },
        {
          type: "SET_REDEEMED_BEVEGRAM_LIST",
          payload: { list: redeemedList ? redeemedList : {} },
        },
      ]),
    );
  } catch (e) {
    yield put({
      type: "SHOW_ALERT_BANNER",
      payload: {
        message: "Unable to update history",
      },
    });
  } finally {
    yield put({ type: "SUCCESSFUL_HISTORY_UPDATE" });
  }
}

//  End Update History --------------------------------------------------}}}
//  One Time Listeners -------------------------------------------------{{{

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

//  End One Time Listeners ---------------------------------------------}}}
//  Transaction Status Parser Functions --------------------------------{{{

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

//  End Transaction Status Parser Functions ----------------------------}}}
//  Status Watching Listeners ------------------------------------------{{{

// Start a lister on a transaction status node, listen until the transaction
// is finished, stop the listener
function* listenUntilTransactionSuccessOrFailure(
  url: string,
  onUpdateActionName: string,
  prettyName: string,
) {
  const actionName = "TRANSACTION_UPDATE";

  StartListenerOnUrl(url, data => {
    store.dispatch({
      type: actionName,
      payload: {
        data,
      },
    });
  });

  try {
    const serverTimeout = 10000;
    const serverResponse = yield race({
      changedNode: call(function*() {
        while (true) {
          const actionResult = yield take(actionName);

          const isTransactionFinished = transactionFinished(
            actionResult.payload.data,
          );

          yield put({
            ...actionResult,
            type: onUpdateActionName,
          });

          if (isTransactionFinished) {
            break;
          }
        }
      }),
      timeout: call(delay, serverTimeout),
    });

    if (serverResponse.timeout) {
      // Make a last ditch effort to read the url
      const transaction = yield call(readNode, url);

      if (transactionFinished(transaction)) {
        yield put({
          type: onUpdateActionName,
          data: transaction,
        });
      } else {
        yield put({
          type: onUpdateActionName,
          payload: {
            error: "Server Timeout",
          },
        });
      }
    } else {
      yield put({
        type: "SET_BRANDING_TEXT",
        payload: {
          text: `${prettyName} Successful!`,
        },
      });
    }
  } catch (e) {
    yield put({
      type: onUpdateActionName,
      payload: {
        error: `Could not process transaction: ${e.toString()}`,
      },
    });

    firebase
      .crash()
      .log(
        `Failed while listening for changes on url "${url}". ${e.toString()}`,
      );
  } finally {
    StopListenerOnUrl(url);
  }
}

export function* listenUntilPurchaseSuccessOrFailure() {
  const user: User = yield select<{ user: User }>(state => state.user);
  const url = DbSchema.GetPurchaseTransactionStatusDbUrl(user.firebase.uid);

  yield call(
    listenUntilTransactionSuccessOrFailure,
    url,
    "UPDATE_PURCHASE_TRANSACTION_STATUS",
    "Purchase",
  );
}

export function* listenUntilRedeemSuccessOrFailure() {
  const user: User = yield select<{ user: User }>(state => state.user);
  const url = DbSchema.GetRedeemTransactionStatusDbUrl(user.firebase.uid);

  yield call(
    listenUntilTransactionSuccessOrFailure,
    url,
    "UPDATE_REDEEM_TRANSACTION_STATUS",
    "Redeem",
  );
}

//  End Status Watching Listeners --------------------------------------}}}
