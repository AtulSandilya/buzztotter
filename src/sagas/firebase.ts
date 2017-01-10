import {Alert} from 'react-native';
import { call, put, select } from 'redux-saga/effects';

import {FirebaseUser, UserState} from '../reducers/user';

import {
  PurchasedBevegram,
  ReceivedBevegram,
  RedeemedBevegram,
  SentBevegram,
} from '../db/tables';

import {StringifyDate} from '../Utilities';

import {
  firebaseLogOut as apiFirebaseLogOut,
  firebaseLoginViaFacebookToken,
  getFirebaseId,
  readUserReceivedBevegrams,
  initializeFirebaseUserFacebookId,
  isUserLoggedIn,
  updateFirebaseUser as apiUpdateFirebaseUser,
  addPurchasedBevegramToUser,
  addSentBevegramToUser,
  addReceivedBevegramToReceiverBevegrams,
  addRedeemedBevegram,
  updatePurchasedBevegramWithSendId,
  updateReceivedBevegramAsRedeemed
} from '../api/firebase';

//  Login / Logout ------------------------------------------------------{{{

export function *firebaseFacebookLogin(action) {
  try {
    yield put({type: 'ATTEMPING_FIREBASE_LOGIN'});
    const firebaseCredential = yield call(firebaseLoginViaFacebookToken, action.payload.token);

    const firebaseUser: FirebaseUser = Object.assign({}, {
      displayName: firebaseCredential.displayName,
      email: firebaseCredential.email,
      emailVerified: firebaseCredential.emailVerified,
      photoURL: firebaseCredential.photoURL,
      refreshToken: firebaseCredential.refreshToken,
      uid: firebaseCredential.uid,
    })

    const facebookId = yield select((state) => state.user.facebook.id)
    yield call(initializeFirebaseUserFacebookId, firebaseUser.uid, facebookId);

    yield put({type: 'SUCCESSFUL_FIREBASE_LOGIN', payload: {
      firebaseUser: firebaseUser
    }});

  } catch(e) {
    yield put({type: 'FAILED_FIREBASE_LOGIN'});
  }
}

export function *firebaseLogOut(action){
  try{
    yield put({type: 'ATTEMPTING_FIREBASE_LOGOUT'});
    yield call(apiFirebaseLogOut);
    yield put({type: 'SUCCESSFUL_FIREBASE_LOGOUT'});
  } catch(e){
    yield put({type: 'FAILED_FIREBASE_LOGOUT'});
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
//           yield put({type: ''})
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
    console.log("receivedFirebaseId: ", receiverFirebaseId);
    if(!receiverFirebaseId) throw Error;
    return receiverFirebaseId;
  } catch(e) {
    alert(`Unable to send Bevegram! ${action.payload.sendBevegramData.recipentName} does not exist in our records.`);
    throw Error(`getFirebaseId for receiver "${receiverFacebookId}" does not exist!`);
  }
}

//  End Utilities -------------------------------------------------------}}}
//  User ----------------------------------------------------------------{{{

export function *updateFirebaseUser(action) {
  const user: UserState = yield select((state) => state.user);
  try {
    yield put({type: 'ATTEMPTING_FIREBASE_UPDATE_USER'});

    yield call(apiUpdateFirebaseUser, user);

    yield put({type: 'SUCCESSFUL_FIREBASE_UPDATE_USER'});
  } catch(e){
    console.log("Failed firebase update user: ", e);
    yield put({type: 'FAILED_FIREBASE_UPDATE_USER', payload: {
      error: e,
    }});
  }
}

//  End User ------------------------------------------------------------}}}
//  Purchasing ----------------------------------------------------------{{{

interface PurchasedBevegramPack {
  id: string;
  purchasedBevegram: PurchasedBevegram;
}

export function *addPurchasedBevegramToDB(action, chargeId) { // returns PurchaseBevegramPack
  const user: UserState = yield select((state) => state.user);
  const purchasedBevegram: PurchasedBevegram = {
    purchasedByName: user.fullName,
    purchasedById: user.firebase.uid,
    purchasedByFacebookId: user.facebook.id,
    purchaseDate: StringifyDate(),
    chargeId: chargeId,
    quantity: action.payload.purchaseData.quantity,
    // In cents
    purchasePrice: action.payload.purchaseData.amount,
    // Used on credit card statement.
    description: action.payload.purchaseData.description,
  }

  const purchaseId = yield call(addPurchasedBevegramToUser, user.firebase.uid, purchasedBevegram);

  return {
    id: purchaseId,
    purchasedBevegram: purchasedBevegram,
  }
}

//  End Purchasing ------------------------------------------------------}}}
//  Sending -------------------------------------------------------------{{{

export function *addSentBevegramToDB(action, purchasedBevegramId) {
  const user: UserState = yield select((state) => state.user);
  const sentBevegram: SentBevegram = {
    purchasedBevegramId: purchasedBevegramId,
    quantity: action.payload.sendBevegramData.quantity,
    sendDate: StringifyDate(),
  }

  const sendId = yield call(addSentBevegramToUser, user.firebase.uid, sentBevegram);

  return {
    id: sendId,
    sentBevegram: sentBevegram,
  }
}

export function *addSendIdToPurchasedBevegram(action, purchaseId: string, sendId: string) {
  const userId: string = yield select((state) => state.user.firebase.uid);
  yield call(updatePurchasedBevegramWithSendId, userId, purchaseId, sendId);
}

//  End Sending ---------------------------------------------------------}}}
//  Receiving -----------------------------------------------------------{{{

export function *addReceivedBevegramToDB(action, receiverFirebaseId: string) {
  const user: UserState = yield select((state) => state.user);
  const receivedBevegram: ReceivedBevegram = {
    sentFromName: user.fullName,
    sentFromFacebookId: user.facebook.id,
    sentFromPhotoUrl: user.firebase.photoURL,
    receivedDate: StringifyDate(),
    message: action.payload.sendBevegramData.message,
    isRedeemed: false,
    quantity: action.payload.sendBevegramData.quantity,
  }

  yield call(addReceivedBevegramToReceiverBevegrams, receiverFirebaseId, receivedBevegram);
}

export function *updateReceivedBevegrams() {
  const userFirebaseId = yield select((state) => state.user.firebase.uid);
  const result = yield call(readUserReceivedBevegrams, userFirebaseId);
  return result;
}

//  End Receiving -------------------------------------------------------}}}
//  Redeeming -----------------------------------------------------------{{{

interface RedeemedBevegramPack {
  id: string;
  redeemedBevegram: RedeemedBevegram;
}

export function *addRedeemedBevegramToDB(action) {
  const user: UserState = yield select((state) => state.user);
  const redeemedBevegram: RedeemedBevegram = {
    redeemedByName: user.fullName,
    redeemedByFacebookId: user.facebook.id,
    redeemedByPhotoUrl: user.firebase.photoURL,
    redeemedDate: StringifyDate(),
    // TODO: Read props below from action.payload
    vendorName: "string",
    vendorPin: "string",
    vendorId: "string",
    quantity: 1
  }

  const id = yield call(addRedeemedBevegram, user.firebase.uid, "vendorId", redeemedBevegram);
  yield call(updateReceivedBevegramAsRedeemed, user.firebase.uid, action.payload.receivedBevegramId);

  return {
    id: id,
    redeemedBevegram: redeemedBevegram,
  }
}

//  End Redeeming -------------------------------------------------------}}}
