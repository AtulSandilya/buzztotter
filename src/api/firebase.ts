import * as firebase from 'firebase';

import secrets from '../secrets';

import {UserState} from '../reducers/user';

const Tables = {
  Users: "users",
}

//  Init Firebase ------------------------------------------------------ {{{

const firebaseConfig = {
  apiKey: secrets.firebaseApiKey,
  authDomain: secrets.firebaseAuthDomain,
  databaseURL: secrets.firebaseDatabaseURL,
  storageBucket: secrets.firebaseStorageBucket,
}

const firebaseApp = firebase.initializeApp(firebaseConfig);

//  End Init Firebase -------------------------------------------------- }}}
//  Login/Logout ----------------------------------------------------- {{{

export function firebaseLoginViaFacebookToken(token: string): any {
  const credential = firebase.auth.FacebookAuthProvider.credential(token);
  return firebase.auth().signInWithCredential(credential);
}

export const firebaseLogOut = (): any => {
  return firebase.auth().signOut();
}

//  End Login/Logout ------------------------------------------------- }}}

const db = firebase.database();

export const updateFirebaseUser = (user: UserState): any => {
  const userFirebaseId = user.firebase.uid;
  return db.ref(`${Tables.Users}/${userFirebaseId}`).set(user);
}
