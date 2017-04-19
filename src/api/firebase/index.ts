import * as firebase from "firebase";

import publicApiKeys from "../../publicApiKeys";

import * as DbSchema from "../../db/schema";
import FirebaseDb from "./FirebaseDb";

import {
  AddCreditCardToCustomerPackageForQueue,
  Notification,
  PromoCodePackage,
  PurchasedBevegram,
  PurchasedBevegramSummary,
  PurchasePackageForQueue,
  ReceivedBevegram,
  ReceivedBevegramSummary,
  RedeemedBevegram,
  RedeemPackageForQueue,
  RemoveCreditCardFromCustomerPackageForQueue,
  SentBevegram,
  SentBevegramSummary,
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
//  Purchase List ------------------------------------------------------{{{

export const addPurchasedBevegramToUser = (userFirebaseId: string, purchasedBevegram: PurchasedBevegram): string => {
  const id = firebaseUserDb.pushNode(DbSchema.GetPurchasedBevegramListDbUrl(userFirebaseId), purchasedBevegram);
  addPurchasedBevegramToUserPurchaseSummary(userFirebaseId, purchasedBevegram);
  return id;
};

export const updatePurchasedBevegramWithSendId = (firebaseId: string, purchaseId: string, sendId: string): any => {
  firebaseUserDb.updateNode(
    DbSchema.GetPurchasedBevegramListDbUrl(firebaseId) + `/${purchaseId}`,
    (purchasedBevegram) => {
      return Object.assign({}, purchasedBevegram, {
        sentBevegramId: sendId,
      });
  });
};

export const readPurchasedBevegrams = (userFirebaseId: string) => {
  return firebaseUserDb.readNode(DbSchema.GetPurchasedBevegramListDbUrl(userFirebaseId));
};

export const readPurchasedBevegramsSummary = (userFirebaseId: string) => {
  return firebaseUserDb.readNode(DbSchema.GetPurchasedBevegramSummaryDbUrl(userFirebaseId));
};

//  End Purchase List --------------------------------------------------}}}
//  Purchase Summary ---------------------------------------------------{{{

export const addPurchasedBevegramToPurchaseSummary = (
  summary: PurchasedBevegramSummary,
  purchasedBevegram: PurchasedBevegram,
): PurchasedBevegramSummary => {
  return Object.assign({}, summary, {
    availableToSend: FirebaseDb.SafeAdd(summary.availableToSend, purchasedBevegram.quantity),
    quantityPurchased: FirebaseDb.SafeAdd(summary.quantityPurchased, purchasedBevegram.quantity),
    sent: FirebaseDb.SafeAdd(summary.sent, 0),
  });
};

const addPurchasedBevegramToUserPurchaseSummary = (
  userFirebaseId: string,
  purchasedBevegram: PurchasedBevegram,
) => {
  firebaseUserDb.updateNode(DbSchema.GetPurchasedBevegramSummaryDbUrl(userFirebaseId), (summary) => {
    return addPurchasedBevegramToPurchaseSummary(summary, purchasedBevegram);
  });
};

export const removeSentBevegramFromPurchaseSummary = (
  purchaseSummary: PurchasedBevegramSummary,
  sentBevegram: SentBevegram,
): PurchasedBevegramSummary => {
  return Object.assign({}, purchaseSummary, {
    availableToSend: FirebaseDb.SafeSubtract(purchaseSummary.availableToSend, sentBevegram.quantity),
    quantityPurchased: FirebaseDb.SafeAdd(purchaseSummary.quantityPurchased, 0),
    sent: FirebaseDb.SafeAdd(purchaseSummary.sent, sentBevegram.quantity),
  });
};

const removeSentBevegramFromUserPurchaseSummary = (
  userFirebaseId: string,
  sentBevegram: SentBevegram,
) => {
  firebaseUserDb.updateNode(DbSchema.GetPurchasedBevegramSummaryDbUrl(userFirebaseId), (summary) => {
    return removeSentBevegramFromPurchaseSummary(summary, sentBevegram);
  });
};

//  End Purchase Summary -----------------------------------------------}}}
//  Sent List -----------------------------------------------------------{{{

export const addSentBevegramToUser = (userFirebaseId: string, sentBevegram: SentBevegram) => {
  const id = firebaseUserDb.pushNode(DbSchema.GetSentBevegramListDbUrl(userFirebaseId), sentBevegram);

  removeSentBevegramFromUserSentSummary(userFirebaseId, sentBevegram);
  removeSentBevegramFromUserPurchaseSummary(userFirebaseId, sentBevegram);

  return id;
};

export const readSentBevegrams = (userFirebaseId: string) => {
  return firebaseUserDb.readNode(DbSchema.GetSentBevegramListDbUrl(userFirebaseId));
};

//  End Sent List -------------------------------------------------------}}}
//  Sent Summary --------------------------------------------------------{{{

export const addSentBevegramToSentSummary = (
  summary: SentBevegramSummary,
  sentBevegram: SentBevegram,
): SentBevegramSummary => {
  return Object.assign({}, summary, {
    availableToSend: FirebaseDb.SafeAdd(summary.availableToSend, 0),
    sent: FirebaseDb.SafeAdd(summary.sent, sentBevegram.quantity),
  });
};

const addSentBevegramToUserSentSummary = (
  userFirebaseId: string,
  sentBevegram: SentBevegram,
) => {
  firebaseUserDb.updateNode(DbSchema.GetSentBevegramListDbUrl(userFirebaseId), (summary) => {
    return addSentBevegramToSentSummary(summary, sentBevegram);
  });
};

export const removeSentBevegramFromSentSummary = (
  summary: SentBevegramSummary,
  sentBevegram: SentBevegram,
) => {
  return Object.assign({}, {
    availableToSend: FirebaseDb.SafeSubtract(summary.availableToSend, sentBevegram.quantity),
    sent: FirebaseDb.SafeAdd(summary.sent, sentBevegram.quantity),
  });
};

const removeSentBevegramFromUserSentSummary = (userFirebaseId: string, sentBevegram: SentBevegram) => {
  firebaseUserDb.updateNode(DbSchema.GetSentBevegramSummaryDbUrl(userFirebaseId), (summary) => {
    return removeSentBevegramFromSentSummary(summary, sentBevegram);
  });
};

//  End Sent Summary ----------------------------------------------------}}}
//  Received List -------------------------------------------------------{{{

export const addReceivedBevegramToReceiverBevegrams = (
  receiverFirebaseId: string,
  receivedBevegram: ReceivedBevegram,
) => {
  const id = firebaseUserDb.pushNode(DbSchema.GetReceivedBevegramListDbUrl(receiverFirebaseId), receivedBevegram);

  addReceivedBevegramToReceiverReceivedSummary(receiverFirebaseId, receivedBevegram);

  return id;
};

export const readReceivedBevegrams = (userFirebaseId: string) => {
  return firebaseUserDb.readNode(DbSchema.GetReceivedBevegramListDbUrl(userFirebaseId));
};

export const updateReceivedBevegramAsRedeemed = (userFirebaseId: string, receivedBevegramId: string): any => {
  firebaseUserDb.updateNode(
    DbSchema.GetReceivedBevegramListDbUrl(userFirebaseId) + `/${receivedBevegramId}`,
    (receivedBevegram) => {
      return Object.assign({}, receivedBevegram, {
        isRedeemed: true,
    });
  });
};

//  End Received List ---------------------------------------------------}}}
//  Received Summary ----------------------------------------------------{{{

export const addReceivedBevegramToReceivedSummary = (
  summary: ReceivedBevegramSummary,
  receivedBevegram: ReceivedBevegram,
) => {
  return Object.assign({}, summary, {
    availableToRedeem: FirebaseDb.SafeAdd(summary.availableToRedeem, receivedBevegram.quantity),
    redeemed: FirebaseDb.SafeAdd(summary.redeemed, 0),
    total: FirebaseDb.SafeAdd(summary.total, receivedBevegram.quantity),
  });
};

export const addReceivedBevegramToReceiverReceivedSummary = (
  receiverFirebaseId: string,
  receivedBevegram: ReceivedBevegram,
) => {
  firebaseUserDb.updateNode(DbSchema.GetReceivedBevegramSummaryDbUrl(receiverFirebaseId), (summary) => {
    return addReceivedBevegramToReceivedSummary(summary, receivedBevegram);
  });
};

export const removeRedeemedBevegramFromReceivedSummary = (
  summary: ReceivedBevegramSummary,
  redeemedBevegram: RedeemedBevegram,
) => {
  return Object.assign({}, summary, {
    availableToRedeem: FirebaseDb.SafeSubtract(summary.availableToRedeem, redeemedBevegram.quantity),
    redeemed: FirebaseDb.SafeAdd(summary.redeemed, redeemedBevegram.quantity),
    total: FirebaseDb.SafeAdd(summary.redeemed, 0),
  });
};

const removeRedeemedBevegramFromUserReceivedSummary = (
  userFirebaseId: string,
  redeemedBevegram: RedeemedBevegram,
) => {
  firebaseUserDb.updateNode(DbSchema.GetReceivedBevegramSummaryDbUrl(userFirebaseId), (summary) => {
    return removeRedeemedBevegramFromReceivedSummary(summary, redeemedBevegram);
  });
};

//  End Received Summary ------------------------------------------------}}}
//  Redeemed List -------------------------------------------------------{{{

// Batch all redeemed db calls into one function
export const addRedeemedBevegram = (userFirebaseId: string, vendorId: string, redeemedBevegram: RedeemedBevegram) => {
  firebaseUserDb.pushNode(DbSchema.GetRedeemedBevegramVendorDbUrl(vendorId), redeemedBevegram);

  const id = firebaseUserDb.pushNode(DbSchema.GetRedeemedBevegramUserDbUrl(userFirebaseId), redeemedBevegram);

  firebaseUserDb.updateNode(DbSchema.GetRedeemedBevegramVendorCustomerDbUrl(vendorId), (customerList) => {
    const newCustomer = {};
    newCustomer[userFirebaseId] = true;
    return Object.assign({}, customerList, newCustomer);
  });

  return id;
};

export const readRedeemedBevegrams = (userFirebaseId: string) => {
  return firebaseUserDb.readNode(DbSchema.GetRedeemedBevegramUserListDbUrl(userFirebaseId));
};

//  End Redeemed List ---------------------------------------------------}}}
//  PromoCode -----------------------------------------------------------{{{

const updatePromoCodeSummary = (promoCode: string, promoCodePack: PromoCodePackage) => {
  firebaseUserDb.updateNode(DbSchema.GetPromoCodeSummaryDbUrl(promoCode), (summary) => {
    return Object.assign({}, {
        total: FirebaseDb.SafeAdd(promoCodePack.quantity, summary.total),
    });
  });
};

export const addPromoCode = (promoCode: string, promoCodePack: PromoCodePackage) => {
  updatePromoCodeSummary(promoCode, promoCodePack);
  firebaseUserDb.pushNode(DbSchema.GetPromoCodeListDbUrl(promoCode), promoCodePack);
};

//  End PromoCode -------------------------------------------------------}}}
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
