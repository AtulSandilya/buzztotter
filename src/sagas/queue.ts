import { call, select } from "redux-saga/effects";

import uuid from "react-native-uuid";

import { User } from "../db/tables";
import {RedeemStateProps} from "../reducers/redeem";

import {
  DbWriteUserVerificationToken,
  QueueAddCreditCardToCustomerPackage,
  QueuePurchasePackage,
  QueueRedeemPackage,
  QueueRemoveCreditCardFromCustomerPackage,
  QueueToggleNotificationSettingPackage,
  QueueUpdateDefaultCreditCard,
} from "../api/firebase";

import {
  AddCreditCardToCustomerPackageForQueue,
  PurchaseActionData,
  PurchasePackageForQueue,
  RedeemPackageForQueue,
  RemoveCreditCardFromCustomerPackageForQueue,
  SendActionData,
  ToggleNotificationSettingPackageForQueue,
  UpdateDefaultCreditCardForCustomerPackageForQueue,
} from "../db/tables";

function* getUserFirebaseId() {
  return yield select<{ user: User }>(state => state.user.firebase.uid);
}

// firebase-queue does not have a method for determining which user sent a
// request. This is a hack to verify that the sending user is who they say
// they are. On a device a user can only write to their verification node, the
// server checks this node and if it matches then the server continues
function* writeVerificationToken() {
  const token = uuid.v4();
  yield call(
    DbWriteUserVerificationToken,
    token,
    yield call(getUserFirebaseId),
  );
  return token;
}

export function* addCreditCardToCustomer(stripeCreditCardToken: string) {
  const verificationToken = yield call(writeVerificationToken);

  const addCreditCardToCustomerPackage: AddCreditCardToCustomerPackageForQueue = {
    stripeCreditCardToken,
    userFirebaseId: yield call(getUserFirebaseId),
    verificationToken,
  };

  yield call(
    QueueAddCreditCardToCustomerPackage,
    addCreditCardToCustomerPackage,
  );
}

export function* removeCreditCardFromCustomer(action: any) {
  const verificationToken = yield call(writeVerificationToken);
  const stripeCardId = action.payload.cardToDelete;
  const removeCreditCardPackage: RemoveCreditCardFromCustomerPackageForQueue = {
    stripeCardId,
    userFirebaseId: yield call(getUserFirebaseId),
    verificationToken,
  };

  yield call(QueueRemoveCreditCardFromCustomerPackage, removeCreditCardPackage);
}

export function* updateDefaultCard(action: any) {
  const verificationToken = yield call(writeVerificationToken);
  const stripeCardId = action.payload.newDefaultCard;
  const updateDefaultCardPackage: UpdateDefaultCreditCardForCustomerPackageForQueue = {
    stripeCardId,
    userFirebaseId: yield call(getUserFirebaseId),
    verificationToken,
  };

  yield call(QueueUpdateDefaultCreditCard, updateDefaultCardPackage);
}

export function* purchase(action: any) {
  const verificationToken = yield call(writeVerificationToken);
  const purchaseData: PurchaseActionData = action.payload.purchaseData;
  const sendBevegramData: SendActionData = action.payload.sendBevegramData;
  const purchasePackageForQueue: PurchasePackageForQueue = {
    purchasePrice: purchaseData.price,
    purchaseQuantity: purchaseData.quantity,
    receiverFacebookId: sendBevegramData.facebookId,
    userFirebaseId: yield call(getUserFirebaseId),
    verificationToken,
  };

  const promoCode = purchaseData.promoCode;
  if (promoCode && promoCode.length > 0) {
    purchasePackageForQueue.promoCode = promoCode;
  }

  const message = yield select<{ message: any }>(
    state => state.message.message,
  );
  if (message && message.length > 0) {
    purchasePackageForQueue.message = message;
  }

  yield call(QueuePurchasePackage, purchasePackageForQueue);
}

export function* redeem() {
  const verificationToken = yield call(writeVerificationToken);
  const redeemProps: RedeemStateProps = yield select<{redeem: RedeemStateProps}>(state => state.redeem);

  const redeemPackageForQueue: RedeemPackageForQueue = {
    ...redeemProps,
    userFirebaseId: yield call(getUserFirebaseId),
    verificationToken,
  };

  yield call(QueueRedeemPackage, redeemPackageForQueue);
}

export function* turnOnNotifications(fcmToken: string) {
  console.log("fcmToken: ", fcmToken);
  yield call(toggleNotificationSetting, fcmToken);
}

export function* turnOffNotifications() {
  yield call(toggleNotificationSetting);
}

function* toggleNotificationSetting(fcmToken?: string) {
  const verificationToken = yield call(writeVerificationToken);
  const toggleNotificationSettingPackageForQueue: ToggleNotificationSettingPackageForQueue = {
    userFirebaseId: yield call(getUserFirebaseId),
    verificationToken,
  };

  if (fcmToken) {
    /* tslint:disable:no-string-literal */
    toggleNotificationSettingPackageForQueue["fcmToken"] = fcmToken;
  }

  yield call(
    QueueToggleNotificationSettingPackage,
    toggleNotificationSettingPackageForQueue,
  );
}
