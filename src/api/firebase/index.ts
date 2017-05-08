import * as firebase from "firebase";

import publicApiKeys from "../../publicApiKeys";

import * as DbSchema from "../../db/schema";
import FirebaseDb from "./FirebaseDb";

import {
  AddCreditCardToCustomerPackageForQueue,
  PurchasePackageForQueue,
  RedeemPackageForQueue,
  RemoveCreditCardFromCustomerPackageForQueue,
  UpdateDefaultCreditCardForCustomerPackageForQueue,
  User,
} from "../../db/tables";

//  Init Firebase ------------------------------------------------------ {{{

const firebaseConfig = {
  apiKey: publicApiKeys.firebaseApiKey,
  authDomain: publicApiKeys.firebaseAuthDomain,
  databaseURL: publicApiKeys.firebaseDatabaseURL,
  storageBucket: publicApiKeys.firebaseStorageBucket,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseUserDb = new FirebaseDb(firebase.database());

//  End Init Firebase -------------------------------------------------- }}}
//  Login/Logout ----------------------------------------------------- {{{

export function firebaseLoginViaFacebookToken(token: string): any {
  const credential = firebase.auth.FacebookAuthProvider.credential(token);
  return firebase.auth().signInWithCredential(credential);
}

export const firebaseLogOut = (): any => {
  return firebase.auth().signOut();
};

export const isUserLoggedIn = () => {
  return firebase.auth().currentUser ? false : true;
};

//  End Login/Logout ------------------------------------------------- }}}
//  Utilities ----------------------------------------------------------{{{

type FirebaseDbEvent =  "child_added" | "child_changed" | "child_removed";

export const OnNextNodeEvent = (url: string, firebaseDbEvent: FirebaseDbEvent) => {
  return new Promise((resolve) => {
    firebaseUserDb.getRef(url).once(firebaseDbEvent, (data) => {
      // Resolve the whole node instead of just the updated data (data.val())
      firebaseUserDb.readNode(url).then((newValue) => {
        resolve(newValue);
      });
    });
  });
};

// Caveat: This event only triggers when the node at the url is changed, if a
// node is added or removed this event does not fire. The way the server
// handles this is to always update the `lastModified` value of `user` which
// always triggers a `child_changed` event. Currently firebase's `child_added`
// event does not do what we need it to do (it fires multiple times initially
// for each node, THEN, waits for events), meaning we can't use `child_added`
// and `child_removed`.
// TLDR: This only fires if you change a child node, adding and removing a
// node is not changing (to firebase).
export const OnNextUserNodeChange = (userFirebaseId: string) => {
  return OnNextNodeEvent(DbSchema.GetUserDbUrl(userFirebaseId), "child_changed");
};

export const OnNextPurchaseTransactionStatusChange = (userFirebaseId: string) => {
  return OnNextNodeEvent(DbSchema.GetPurchaseTransactionStatusDbUrl(userFirebaseId), "child_changed");
};

//  End Utilities ------------------------------------------------------}}}
//  User -------------------------------------------------------{{{

export const initializeFirebaseUserFacebookId = (firebaseId: string, facebookId: string): any => {
  return firebaseUserDb.writeNode(DbSchema.GetFirebaseIdDbUrl(facebookId), firebaseId);
};

export const updateFirebaseUser = (user: User): any => {
  const userFirebaseId = user.firebase.uid;

  // TODO: Is it possible to have differences between the on device user state
  // and the database user state? If so, how should this be reconciled, what
  // data is the "best". One possible way is to add `lastModified` timestamps
  // to specific data reads/writes (facebook login, firebase login, stripe
  // updates) and use the one with the most current lastModified date.
  //
  // Or, just use firebase's realtime data features?
  // const savedUserState: User = getFirebaseUser(user.firebase.uid);

  // if(user.lastModified != savedUserState.lastModified) {
  // }

  // return db.ref(DbSchema.GetUserDbUrl(userFirebaseId)).set(user);
  return firebaseUserDb.writeNode(DbSchema.GetUserDbUrl(userFirebaseId), user);
};

export const getFirebaseUser = (userFirebaseId: string): any => {
  return firebaseUserDb.readNode(DbSchema.GetUserDbUrl(userFirebaseId));
};

//  End User ---------------------------------------------------}}}
//  Firebase / Facebook Id Conversion -----------------------------------{{{

export const getFirebaseId = (facebookId: string): any => {
  return firebaseUserDb.readNode(DbSchema.GetFirebaseIdDbUrl(facebookId));
};

//  End Firebase / Facebook Id Conversion -------------------------------}}}
//  Fcm Tokens ----------------------------------------------------------{{{

export const setFcmToken = (facebookId: string, fcmToken: string): any => {
  return firebaseUserDb.writeNode(DbSchema.GetFcmTokenDbUrl(facebookId), fcmToken);
};

export const getFcmToken = (facebookId: string): any => {
  return firebaseUserDb.readNode(DbSchema.GetFcmTokenDbUrl(facebookId));
};

//  End Fcm Tokens ------------------------------------------------------}}}

export const readPurchasedBevegrams = (userFirebaseId: string) => {
  return firebaseUserDb.readNode(DbSchema.GetPurchasedBevegramListDbUrl(userFirebaseId));
};

export const readPurchasedBevegramsSummary = (userFirebaseId: string) => {
  return firebaseUserDb.readNode(DbSchema.GetPurchasedBevegramSummaryDbUrl(userFirebaseId));
};

export const readSentBevegrams = (userFirebaseId: string) => {
  return firebaseUserDb.readNode(DbSchema.GetSentBevegramListDbUrl(userFirebaseId));
};

export const readReceivedBevegrams = (userFirebaseId: string) => {
  return firebaseUserDb.readNode(DbSchema.GetReceivedBevegramListDbUrl(userFirebaseId));
};

export const readRedeemedBevegrams = (userFirebaseId: string) => {
  return firebaseUserDb.readNode(DbSchema.GetRedeemedBevegramUserListDbUrl(userFirebaseId));
};
//  PurchasePackages ----------------------------------------------------{{{

export const getPurchasePackages = () => {
  return firebaseUserDb.readNode(DbSchema.GetPurchasePackagesDbUrl());
};

//  End PurchasePackages ------------------------------------------------}}}
//  Queue Notification --------------------------------------------------{{{

// Adding an object to a queue url requires putting the object in the
// "tasks" node
const TaskifyUrl = (url: string): string => {
  return `${url}/tasks`;
};

export const QueueAddCreditCardToCustomerPackage = (inputPackage: AddCreditCardToCustomerPackageForQueue) => {
  firebaseUserDb.pushNode(TaskifyUrl(DbSchema.GetAddCreditCardToCustomerQueueUrl()), inputPackage);
};

export const QueueRemoveCreditCardFromCustomerPackage = (inputPackage: RemoveCreditCardFromCustomerPackageForQueue) => {
  firebaseUserDb.pushNode(TaskifyUrl(DbSchema.GetRemoveCreditCardFromCustomerQueueUrl()), inputPackage);
};

export const QueueUpdateDefaultCreditCard = (input: UpdateDefaultCreditCardForCustomerPackageForQueue) => {
  firebaseUserDb.pushNode(TaskifyUrl(DbSchema.GetUpdateDefaultCreditCardForCustomerUrl()), input);
};

export const QueuePurchasePackage = (inputPackage: PurchasePackageForQueue) => {
  firebaseUserDb.pushNode(TaskifyUrl(DbSchema.GetPurchaseQueueUrl()), inputPackage);
};

export const QueueRedeemPackage = (inputPackage: RedeemPackageForQueue) => {
  firebaseUserDb.pushNode(TaskifyUrl(DbSchema.GetRedeemQueueUrl()), inputPackage);
};

export const DbWriteUserVerificationToken = (token: string, userFirebaseId: string) => {
  firebaseUserDb.writeNode(DbSchema.GetUserVerificationTokenDbUrl(userFirebaseId), token);
};

//  End Queue Notification ----------------------------------------------}}}
