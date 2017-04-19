import _ from "lodash";

import {
  PurchasedBevegram,
  PurchasedBevegramSummary,
  ReceivedBevegram,
  RedeemedBevegram,
  SentBevegram,
  User,
  Vendor,
} from "./tables";

// This is what the firebase database looks like
/* tslint:disable:object-literal-sort-keys */
const Schema = {
  root: {
    users: {
      firebaseId: "User",
    },
    firebaseIds: {
      facebookId: "FirebaseId",
    },
    fcmTokens: {
      facebookId: "fcmToken",
    },
    vendors: {
      vendorId: "Vendor",
    },
    addCreditCardToCustomerQueue: {
      uniqueId: "AddCreditCardToCustomerPackage",
    },
    removeCreditCardFromCustomerQueue: {
      uniqueId: "RemoveCreditCardFromCustomerPackage",
    },
    updateDefaultCreditCardQueue: {
      uniqueId: "UpdateDefaultCreditCardForCustomerPackageForQueue",
    },
    purchaseQueue: {
      uniqueId: "PurchasePackage",
    },
    redeemQueue: {
      uniqueId: "RedeemPackage",
    },
    userVerificationTokens: {
      userFirebaseId: "token",
    },
    stripeCustomerIds: {
      userFirebaseId: "stripeCustomerId",
    },
    purchasePackages: "ArrayOfPurchasePackages",
    promoCodes: {
      promotionCode: {
        summary: "PromoCodesSummary",
        list: {
          FirebaseUniqueTimeSortableId: "PromoCodePack",
        },
      },
    },
    purchasedBevegrams: {
      firebaseId: {
        summary: "PurchasedBevegramSummary",
        list: {
          FirebaseUniqueTimeSortableId: "PurchasedBevegram",
        },
      },
    },
    sentBevegrams: {
      firebaseId: {
        summary: "SentBevegramSummary",
        list: {
          FirebaseUniqueTimeSortableId: "SentBevegram",
        },
      },
    },
    receivedBevegrams: {
      firebaseId: {
        summary: "ReceivedBevegramSummary",
        list: {
          FirebaseUniqueTimeSortableId: "ReceivedBevegram",
        },
      },
    },
    redeemedBevegrams: {
      vendors: {
        vendorId: {
          // Any user can write to any vendors ledger
          ledger: {
            bevegramList: {
              FirebaseUniqueTimeSortableId: "RedeemedBevegram",
            },
            customerList: {
              // A user may only write to their firebaseId
              firebaseId: true,
            },
          },
        },
      },
      users: {
        firebaseId: {
          FirebaseUniqueTimeSortableId: "RedeemedBevegram",
        },
      },
    },
  },
};

export const GetSchemaDbUrl = (table: string, key?: string | any): string => {
  const urlSeparator = "/";
  const periodsRe = /\./g;

  // Check if the table exists in the Schema
  if (_.has(Schema, ["root", table].join("."))) {

    if (!key) {
      return table.replace(periodsRe, urlSeparator);
    }

    // If `key` is an object, replace the the object key in table with the
    // object value
    if (typeof key === "object") {
      let newTable = table;
      Object.keys(key).map((k) => {
        newTable = newTable.replace(k, key[k]);
      });
      return newTable.replace(periodsRe, urlSeparator);
    }

    return [table, key.replace(periodsRe, urlSeparator)].join(urlSeparator);
  }

  throw Error(`Db Error: Key "${JSON.stringify(key)}" does not exist within table ${table}!`);
};

export const GetUserDbUrl = (firebaseId: string) => {
  return GetSchemaDbUrl("users", firebaseId);
};

export const GetVendorDbUrl = (vendorId: string) => {
  return GetSchemaDbUrl("vendors", vendorId);
};

export const GetFirebaseIdDbUrl = (facebookId: string) => {
  return GetSchemaDbUrl("firebaseIds.facebookId", {facebookId: facebookId});
};

export const GetFcmTokenDbUrl = (facebookId: string) => {
  return GetSchemaDbUrl("fcmTokens.facebookId", {facebookId: facebookId});
};

export const GetAddCreditCardToCustomerQueueUrl = () => {
  return GetSchemaDbUrl("addCreditCardToCustomerQueue");
};

export const GetRemoveCreditCardFromCustomerQueueUrl = () => {
  return GetSchemaDbUrl("removeCreditCardFromCustomerQueue");
};

export const GetUpdateDefaultCreditCardForCustomerUrl = () => {
  return GetSchemaDbUrl("updateDefaultCreditCardQueue");
};

export const GetPurchaseQueueUrl = () => {
  return GetSchemaDbUrl("purchaseQueue");
};

export const GetRedeemQueueUrl = () => {
  return GetSchemaDbUrl("redeemQueue");
};

export const GetUserVerificationTokenDbUrl = (userFirebaseId: string): string => {
  return GetSchemaDbUrl("userVerificationTokens.userFirebaseId", {userFirebaseId: userFirebaseId});
};

export const GetPurchasedBevegramListDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("purchasedBevegrams.firebaseId.list", {firebaseId: firebaseId});
};

export const GetPurchasedBevegramSummaryDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("purchasedBevegrams.firebaseId.summary", {firebaseId: firebaseId});
};

export const GetSentBevegramListDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("sentBevegrams.firebaseId.list", {firebaseId: firebaseId});
};

export const GetSentBevegramSummaryDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("sentBevegrams.firebaseId.summary", {firebaseId: firebaseId});
};

export const GetReceivedBevegramListDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("receivedBevegrams.firebaseId.list", {firebaseId: firebaseId});
};

export const GetReceivedBevegramSummaryDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("receivedBevegrams.firebaseId.summary", {firebaseId: firebaseId});
};

export const GetRedeemedBevegramVendorDbUrl = (vendorId: string): string => {
  return GetSchemaDbUrl("redeemedBevegrams.vendorId.ledger.bevegramList", {vendorId: vendorId});
};

export const GetRedeemedBevegramVendorCustomerDbUrl = (vendorId: string): string => {
  return GetSchemaDbUrl("redeemedBevegrams.vendorId.ledger.customerList", {vendorId: vendorId});
};

export const GetRedeemedBevegramUserDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("redeemedBevegrams.users.firebaseId", {firebaseId: firebaseId});
};

export const GetRedeemedBevegramUserListDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("redeemedBevegrams.users.firebaseId", {firebaseId: firebaseId});
};

export const GetPromoCodeListDbUrl = (promotionCode: string): string => {
  return GetSchemaDbUrl("promoCodes.promotionCode.list", {promotionCode: promotionCode});
};

export const GetPromoCodeSummaryDbUrl = (promotionCode: string): string => {
  return GetSchemaDbUrl("promoCodes.promotionCode.summary", {promotionCode: promotionCode});
};

export const GetStripeCustomerIdDbUrl = (userFirebaseId: string): string => {
  return GetSchemaDbUrl("stripeCustomerIds.userFirebaseId", {userFirebaseId});
};

export const GetPurchasePackagesDbUrl = () => {
  return GetSchemaDbUrl("purchasePackages");
};
