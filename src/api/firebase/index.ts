import * as firebase from "firebase";

import publicApiKeys from "../../publicApiKeys";

import * as DbSchema from "../../db/schema";

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

const db = firebase.database();

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

const PushToUrl = (url: string, pushObject: any): string => {
  Object.keys(pushObject).map((key) => {
    if (typeof(pushObject[key]) === "undefined") {
      console.error(`Firebase chokes on objects with undefined values!
                     Value of key '${key}' for url '${url}' is undefined!`);
      return "";
    }
  });

  const ref = db.ref(url);
  const newNode = ref.push();
  newNode.set(pushObject);
  return newNode.toString().split("/").slice(-1)[0];
};

const WriteNode = (url: string, data: any): any => {
  return db.ref(url).set(data);
};

const UpdateNode = (url: string, updateFunction: (Object) => any) => {
  db.ref(url).transaction((currentData) => {
    return updateFunction(currentData ? currentData : {});
type FirebaseDbEvent =  "child_added" | "child_changed" | "child_removed";

export const OnNextNodeEvent = (url: string, firebaseDbEvent: FirebaseDbEvent) => {
  return new Promise((resolve) => {
    userDb.ref(url).once(firebaseDbEvent, (data) => {
      // Resolve the whole node instead of just the updated data (data.val())
      firebaseUserDb.readNode(url).then((newValue) => {
        resolve(newValue);
      });
    });
  });
};

const ReadNode = (url: string): any => {
  return db.ref(url).once("value").then((snapshot) => {
    return snapshot.val();
  }).catch((error) => {
    return {};
  });
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

// Always returns a number
const SafeAdd = (num1: number, num2: number) => {
  return (!num1 ? 0 : num1) + (!num2 ? 0 : num2);
};

// Always returns a number
const SafeSubtract = (num1: number, num2: number) => {
  return (!num1 ? 0 : num1) - (!num2 ? 0 : num2);
};

//  End Utilities ------------------------------------------------------}}}
//  User -------------------------------------------------------{{{

export const initializeFirebaseUserFacebookId = (firebaseId: string, facebookId: string): any => {
  return WriteNode(DbSchema.GetFirebaseIdDbUrl(facebookId), firebaseId);
};

export const updateFirebaseUser = (user: UserState): any => {
  const userFirebaseId = user.firebase.uid;

  // TODO: Is it possible to have differences between the on device user state
  // and the database user state? If so, how should this be reconciled, what
  // data is the "best". One possible way is to add `lastModified` timestamps
  // to specific data reads/writes (facebook login, firebase login, stripe
  // updates) and use the one with the most current lastModified date.
  //
  // Or, just use firebase's realtime data features?
  // const savedUserState: UserState = getFirebaseUser(user.firebase.uid);

  // if(user.lastModified != savedUserState.lastModified) {
  // }

  return db.ref(DbSchema.GetUserDbUrl(userFirebaseId)).set(user);
};

export const getFirebaseUser = (userFirebaseId: string): any => {
  return ReadNode(DbSchema.GetUserDbUrl(userFirebaseId));
};

//  End User ---------------------------------------------------}}}
//  Firebase / Facebook Id Conversion -----------------------------------{{{

export const getFirebaseId = (facebookId: string): any => {
  return ReadNode(DbSchema.GetFirebaseIdDbUrl(facebookId));
};

//  End Firebase / Facebook Id Conversion -------------------------------}}}
//  Fcm Tokens ----------------------------------------------------------{{{

export const setFcmToken = (facebookId: string, fcmToken: string): any => {
  return WriteNode(DbSchema.GetFcmTokenDbUrl(facebookId), fcmToken);
};

export const getFcmToken = (facebookId: string): any => {
  return ReadNode(DbSchema.GetFcmTokenDbUrl(facebookId));
};

//  End Fcm Tokens ------------------------------------------------------}}}
//  Purchase List ------------------------------------------------------{{{

export const addPurchasedBevegramToUser = (userFirebaseId: string, purchasedBevegram: PurchasedBevegram): string => {
  const id = PushToUrl(DbSchema.GetPurchasedBevegramListDbUrl(userFirebaseId), purchasedBevegram);
  addPurchasedBevegramToUserPurchaseSummary(userFirebaseId, purchasedBevegram);
  return id;
};

export const updatePurchasedBevegramWithSendId = (firebaseId: string, purchaseId: string, sendId: string): any => {
  UpdateNode(DbSchema.GetPurchasedBevegramListDbUrl(firebaseId) + `/${purchaseId}`, (purchasedBevegram) => {
    return Object.assign({}, purchasedBevegram, {
      sentBevegramId: sendId,
    });
  });
};

export const readPurchasedBevegrams = (userFirebaseId: string) => {
  return ReadNode(DbSchema.GetPurchasedBevegramListDbUrl(userFirebaseId));
};

export const readPurchasedBevegramsSummary = (userFirebaseId: string) => {
  return ReadNode(DbSchema.GetPurchasedBevegramSummaryDbUrl(userFirebaseId));
};

//  End Purchase List --------------------------------------------------}}}
//  Purchase Summary ---------------------------------------------------{{{

export const addPurchasedBevegramToPurchaseSummary = (
  summary: PurchasedBevegramSummary,
  purchasedBevegram: PurchasedBevegram,
): PurchasedBevegramSummary => {
  return Object.assign({}, summary, {
    availableToSend: SafeAdd(summary.availableToSend, purchasedBevegram.quantity),
    quantityPurchased: SafeAdd(summary.quantityPurchased, purchasedBevegram.quantity),
    sent: SafeAdd(summary.sent, 0),
  });
};

const addPurchasedBevegramToUserPurchaseSummary = (
  userFirebaseId: string,
  purchasedBevegram: PurchasedBevegram,
) => {
  UpdateNode(DbSchema.GetPurchasedBevegramSummaryDbUrl(userFirebaseId), (summary) => {
    return addPurchasedBevegramToPurchaseSummary(summary, purchasedBevegram);
  });
};

export const removeSentBevegramFromPurchaseSummary = (
  purchaseSummary: PurchasedBevegramSummary,
  sentBevegram: SentBevegram,
): PurchasedBevegramSummary => {
  return Object.assign({}, purchaseSummary, {
    availableToSend: SafeSubtract(purchaseSummary.availableToSend, sentBevegram.quantity),
    quantityPurchased: SafeAdd(purchaseSummary.quantityPurchased, 0),
    sent: SafeAdd(purchaseSummary.sent, sentBevegram.quantity),
  });
};

const removeSentBevegramFromUserPurchaseSummary = (
  userFirebaseId: string,
  sentBevegram: SentBevegram,
) => {
  UpdateNode(DbSchema.GetPurchasedBevegramSummaryDbUrl(userFirebaseId), (summary) => {
    return removeSentBevegramFromPurchaseSummary(summary, sentBevegram);
  });
};

//  End Purchase Summary -----------------------------------------------}}}
//  Sent List -----------------------------------------------------------{{{

export const addSentBevegramToUser = (userFirebaseId: string, sentBevegram: SentBevegram) => {
  const id = PushToUrl(DbSchema.GetSentBevegramListDbUrl(userFirebaseId), sentBevegram);

  removeSentBevegramFromUserSentSummary(userFirebaseId, sentBevegram);
  removeSentBevegramFromUserPurchaseSummary(userFirebaseId, sentBevegram);

  return id;
};

export const readSentBevegrams = (userFirebaseId: string) => {
  return ReadNode(DbSchema.GetSentBevegramListDbUrl(userFirebaseId));
};

//  End Sent List -------------------------------------------------------}}}
//  Sent Summary --------------------------------------------------------{{{

export const addSentBevegramToSentSummary = (
  summary: SentBevegramSummary,
  sentBevegram: SentBevegram,
): SentBevegramSummary => {
  return Object.assign({}, summary, {
    availableToSend: SafeAdd(summary.availableToSend, 0),
    sent: SafeAdd(summary.sent, sentBevegram.quantity),
  });
};

const addSentBevegramToUserSentSummary = (
  userFirebaseId: string,
  sentBevegram: SentBevegram,
) => {
  UpdateNode(DbSchema.GetSentBevegramListDbUrl(userFirebaseId), (summary) => {
    return addSentBevegramToSentSummary(summary, sentBevegram);
  });
};

export const removeSentBevegramFromSentSummary = (
  summary: SentBevegramSummary,
  sentBevegram: SentBevegram,
) => {
  return Object.assign({}, {
    availableToSend: SafeSubtract(summary.availableToSend, sentBevegram.quantity),
    sent: SafeAdd(summary.sent, sentBevegram.quantity),
  });
};

const removeSentBevegramFromUserSentSummary = (userFirebaseId: string, sentBevegram: SentBevegram) => {
  UpdateNode(DbSchema.GetSentBevegramSummaryDbUrl(userFirebaseId), (summary) => {
    return removeSentBevegramFromSentSummary(summary, sentBevegram);
  });
};

//  End Sent Summary ----------------------------------------------------}}}
//  Received List -------------------------------------------------------{{{

export const addReceivedBevegramToReceiverBevegrams = (
  receiverFirebaseId: string,
  receivedBevegram: ReceivedBevegram,
) => {
  const id = PushToUrl(DbSchema.GetReceivedBevegramListDbUrl(receiverFirebaseId), receivedBevegram);

  addReceivedBevegramToReceiverReceivedSummary(receiverFirebaseId, receivedBevegram);

  return id;
};

export const readReceivedBevegrams = (userFirebaseId: string) => {
  return ReadNode(DbSchema.GetReceivedBevegramListDbUrl(userFirebaseId));
};

export const updateReceivedBevegramAsRedeemed = (userFirebaseId: string, receivedBevegramId: string): any => {
  UpdateNode(DbSchema.GetReceivedBevegramListDbUrl(userFirebaseId) + `/${receivedBevegramId}`, (receivedBevegram) => {
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
    availableToRedeem: SafeAdd(summary.availableToRedeem, receivedBevegram.quantity),
    redeemed: SafeAdd(summary.redeemed, 0),
    total: SafeAdd(summary.total, receivedBevegram.quantity),
  });
};

export const addReceivedBevegramToReceiverReceivedSummary = (
  receiverFirebaseId: string,
  receivedBevegram: ReceivedBevegram,
) => {
  UpdateNode(DbSchema.GetReceivedBevegramSummaryDbUrl(receiverFirebaseId), (summary) => {
    return addReceivedBevegramToReceivedSummary(summary, receivedBevegram);
  });
};

export const removeRedeemedBevegramFromReceivedSummary = (
  summary: ReceivedBevegramSummary,
  redeemedBevegram: RedeemedBevegram,
) => {
  return Object.assign({}, summary, {
    availableToRedeem: SafeSubtract(summary.availableToRedeem, redeemedBevegram.quantity),
    redeemed: SafeAdd(summary.redeemed, redeemedBevegram.quantity),
    total: SafeAdd(summary.redeemed, 0),
  });
};

const removeRedeemedBevegramFromUserReceivedSummary = (
  userFirebaseId: string,
  redeemedBevegram: RedeemedBevegram,
) => {
  UpdateNode(DbSchema.GetReceivedBevegramSummaryDbUrl(userFirebaseId), (summary) => {
    return removeRedeemedBevegramFromReceivedSummary(summary, redeemedBevegram);
  });
};

//  End Received Summary ------------------------------------------------}}}
//  Redeemed List -------------------------------------------------------{{{

// Batch all redeemed db calls into one function
export const addRedeemedBevegram = (userFirebaseId: string, vendorId: string, redeemedBevegram: RedeemedBevegram) => {
  PushToUrl(DbSchema.GetRedeemedBevegramVendorDbUrl(vendorId), redeemedBevegram);

  const id = PushToUrl(DbSchema.GetRedeemedBevegramUserDbUrl(userFirebaseId), redeemedBevegram);

  UpdateNode(DbSchema.GetRedeemedBevegramVendorCustomerDbUrl(vendorId), (customerList) => {
    const newCustomer = {};
    newCustomer[userFirebaseId] = true;
    return Object.assign({}, customerList, newCustomer);
  });

  return id;
};

export const readRedeemedBevegrams = (userFirebaseId: string) => {
  return ReadNode(DbSchema.GetRedeemedBevegramUserListDbUrl(userFirebaseId));
};

//  End Redeemed List ---------------------------------------------------}}}
//  PromoCode -----------------------------------------------------------{{{

const updatePromoCodeSummary = (promoCode: string, promoCodePack: PromoCodePackage) => {
  UpdateNode(DbSchema.GetPromoCodeSummaryDbUrl(promoCode), (summary) => {
    return Object.assign({}, {
        total: SafeAdd(promoCodePack.quantity, summary.total),
    });
  });
};

export const addPromoCode = (promoCode: string, promoCodePack: PromoCodePackage) => {
  updatePromoCodeSummary(promoCode, promoCodePack);
  PushToUrl(DbSchema.GetPromoCodeListDbUrl(promoCode), promoCodePack);
};

//  End PromoCode -------------------------------------------------------}}}
//  Queue Notification --------------------------------------------------{{{

// Adding an object to a queue url requires putting the object in the
// "tasks" node
const TaskifyUrl = (url: string): string => {
  return `${url}/tasks`;
};

// TODO: Add type to inputPackage
export const QueueAddCreditCardToCustomerPackage = (inputPackage: any) => {
  PushToUrl(TaskifyUrl(DbSchema.GetAddCreditCardToCustomerQueueUrl()), inputPackage);
};

// TODO: Add type to inputPackage
export const QueueRemoveCreditCardFromCustomerPackage = (inputPackage: any) => {
  PushToUrl(TaskifyUrl(DbSchema.GetRemoveCreditCardFromCustomerQueueUrl()), inputPackage);
};

// TODO: Add type to inputPackage
export const QueuePurchasePackage = (inputPackage: any) => {
  PushToUrl(TaskifyUrl(DbSchema.GetPurchaseQueueUrl()), inputPackage);
};

// TODO: Add type to inputPackage
export const QueueRedeemPackage = (inputPackage: any) => {
  PushToUrl(TaskifyUrl(DbSchema.GetRedeemQueueUrl()), inputPackage);
};

export const DbWriteUserVerificationToken = (token: string, userFirebaseId: string) => {
  WriteNode(DbSchema.GetUserVerificationTokenDbUrl(userFirebaseId), token);
};

//  End Queue Notification ----------------------------------------------}}}
