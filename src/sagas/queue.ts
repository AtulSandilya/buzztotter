import {
  call,
  select,
} from "redux-saga/effects";

import uuid from "react-native-uuid";

import {
  User,
} from "../db/tables";

import {
  DbWriteUserVerificationToken,
  QueueAddCreditCardToCustomerPackage,
  QueuePurchasePackage,
  QueueRedeemPackage,
  QueueRemoveCreditCardFromCustomerPackage,
  QueueUpdateDefaultCreditCard,
} from "../api/firebase";

import {
  AddCreditCardToCustomerPackageForQueue,
  PurchasePackageForQueue,
  RedeemPackageForQueue,
  RemoveCreditCardFromCustomerPackageForQueue,
  UpdateDefaultCreditCardForCustomerPackageForQueue,
} from "../db/tables";

function *getUserFirebaseId() {
  return yield select<{user: User}>((state) => state.user.firebase.uid);
}

// firebase-queue does not have a method for determining which user sent a
// request. This is a hack to verify that the sending user is who they say
// they are. On a device a user can only write to their verification node, the
// server checks this node and if it matches then the server continues
function *writeVerificationToken() {
  const token = uuid.v4();
  yield call(DbWriteUserVerificationToken, token, yield call(getUserFirebaseId));
  return token;
}

export function *addCreditCardToCustomer(stripeCreditCardToken: string) {
  const verificationToken = yield call(writeVerificationToken);

  const addCreditCardToCustomerPackage: AddCreditCardToCustomerPackageForQueue = {
    stripeCreditCardToken,
    userFirebaseId: yield call(getUserFirebaseId),
    verificationToken,
  };

  yield call(QueueAddCreditCardToCustomerPackage, addCreditCardToCustomerPackage);
}

export function *removeCreditCardFromCustomer(action: any) {
  const verificationToken = yield call(writeVerificationToken);
  const stripeCardId = action.payload.cardToDelete;
  const removeCreditCardPackage: RemoveCreditCardFromCustomerPackageForQueue = {
    stripeCardId,
    userFirebaseId: yield call(getUserFirebaseId),
    verificationToken,
  };

  yield call(QueueRemoveCreditCardFromCustomerPackage, removeCreditCardPackage);
}

export function *updateDefaultCard(action: any) {
  const verificationToken = yield call(writeVerificationToken);
  const stripeCardId = action.payload.newDefaultCard;
  const updateDefaultCardPackage: UpdateDefaultCreditCardForCustomerPackageForQueue = {
    stripeCardId,
    userFirebaseId: yield call(getUserFirebaseId),
    verificationToken,
  };

  yield call(QueueUpdateDefaultCreditCard, updateDefaultCardPackage);
}

export function *purchase(input: any) {
  yield call(QueuePurchasePackage, input);
}

export function *redeem(input: any) {
  yield call(QueueRedeemPackage, input);
}