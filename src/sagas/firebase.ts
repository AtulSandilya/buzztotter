import { call, put, select } from 'redux-saga/effects';

import {FirebaseUser, UserState} from '../reducers/user';

import {
  firebaseLoginViaFacebookToken,
  firebaseLogOut as apiFirebaseLogOut,
  updateFirebaseUser,
} from '../api/firebase';

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

export function *fetchFirebaseUpdateUser(action) {
  const user: UserState = yield select((state) => state.user);
  try {
    yield put({type: 'ATTEMPTING_FIREBASE_UPDATE_USER'});

    yield call(updateFirebaseUser, user);

    yield put({type: 'SUCCESSFUL_FIREBASE_UPDATE_USER'});
  } catch(e){
    console.log("Failed firebase update user: ", e);
    yield put({type: 'FAILED_FIREBASE_UPDATE_USER', payload: {
      error: e,
    }});
  }
}
