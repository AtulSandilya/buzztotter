import {Alert} from 'react-native';
import { call, put, select } from 'redux-saga/effects';

import {FirebaseUser, UserState} from '../reducers/user';

import {
  PromoCodePackage,
  PurchasedBevegram,
  ReceivedBevegram,
  RedeemedBevegram,
  SentBevegram,
} from '../db/tables';

import {StringifyDate} from '../Utilities';

import {
  addPromoCode,
  addPurchasedBevegramToUser,
  addReceivedBevegramToReceiverBevegrams,
  addRedeemedBevegram,
  addSentBevegramToUser,
  firebaseLogOut as apiFirebaseLogOut,
  firebaseLoginViaFacebookToken,
  getFirebaseId,
  getFirebaseUser,
  initializeFirebaseUserFacebookId,
  isUserLoggedIn,
  readPurchasedBevegrams,
  readSentBevegrams,
  readReceivedBevegrams,
  readRedeemedBevegrams,
  updateFirebaseUser as apiUpdateFirebaseUser,
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

    const facebookId = yield select<any>((state) => state.user.facebook.id)
    yield call(initializeFirebaseUserFacebookId, firebaseUser.uid, facebookId);

    yield put({type: 'SUCCESSFUL_FIREBASE_LOGIN', payload: {
      firebaseUser: firebaseUser
    }});

    yield call(updateFirebaseUser);

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
  yield put({type: "UPDATE_LAST_MODIFIED", payload: {
    lastModified: StringifyDate(),
  }})

  const user: UserState = yield select<{user: UserState}>((state) => state.user);

  try {
    yield put({type: 'ATTEMPTING_FIREBASE_UPDATE_USER'});

    yield call(apiUpdateFirebaseUser, user);

    yield put({type: 'SUCCESSFUL_FIREBASE_UPDATE_USER'});
  } catch(e){
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
  const user: UserState = yield select<{user: UserState}>((state) => state.user);
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
  const user: UserState = yield select<{user: UserState}>((state) => state.user);
  const sentBevegram: SentBevegram = {
    purchasedBevegramId: purchasedBevegramId,
    quantity: action.payload.sendBevegramData.quantity,
    receiverName: action.payload.sendBevegramData.recipentName,
    sendDate: StringifyDate(),
  }

  const sendId = yield call(addSentBevegramToUser, user.firebase.uid, sentBevegram);

  return {
    id: sendId,
    sentBevegram: sentBevegram,
  }
}

export function *addSendIdToPurchasedBevegram(action, purchaseId: string, sendId: string) {
  const userId: string = yield select<{user: UserState}>((state) => state.user.firebase.uid);
  yield call(updatePurchasedBevegramWithSendId, userId, purchaseId, sendId);
}

//  End Sending ---------------------------------------------------------}}}
//  Receiving -----------------------------------------------------------{{{

export function *addReceivedBevegramToDB(action, receiverFirebaseId: string) {
  const user: UserState = yield select<{user: UserState}>((state) => state.user);
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
  const userFirebaseId = yield select<{user: UserState}>((state) => state.user.firebase.uid);
  const result = yield call(readReceivedBevegrams, userFirebaseId);
  return result;
}

//  End Receiving -------------------------------------------------------}}}
//  Redeeming -----------------------------------------------------------{{{

interface RedeemedBevegramPack {
  id: string;
  redeemedBevegram: RedeemedBevegram;
}

export function *addRedeemedBevegramToDB(action) {
  const user: UserState = yield select<{user: UserState}>((state) => state.user);
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

export function *updateAllLists() {
  const user: UserState = yield select<{user: UserState}>((state) => state.user);
  const userFirebaseId: string = user.firebase.uid;

  const purchasedList = yield call(readPurchasedBevegrams, userFirebaseId);
  const sentList = yield call(readSentBevegrams, userFirebaseId);
  const receivedList = yield call(readReceivedBevegrams, userFirebaseId);
  const redeemedList = yield call(readRedeemedBevegrams, userFirebaseId);

  // In theory doing a lot of puts at the same time should update the state
  // only once.
  yield put({type: 'SET_PURCHASED_BEVEGRAM_LIST', payload: {list: purchasedList}})
  yield put({type: 'SET_SENT_BEVEGRAM_LIST', payload: {list: sentList}})
  yield put({type: 'SET_RECEIVED_BEVEGRAM_LIST', payload: {list: receivedList}})
  yield put({type: 'SET_REDEEMED_BEVEGRAM_LIST', payload: {list: redeemedList}})
}

export function *addPromoCodeToDB(promoCode: string) {
  const userFirebaseId: string = yield select<{user: UserState}>((state) => state.user.firebase.uid);
  const promoCodePackage: PromoCodePackage = {
    purchasedByUserId: userFirebaseId,
    purchaseDate: StringifyDate(),
  }

  yield call(addPromoCode, promoCode, promoCodePackage);
}
