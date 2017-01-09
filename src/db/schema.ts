import _ from 'lodash';

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
const Schema = {
  root: {
    users: {
      firebaseId: "User"
    },
    firebaseIds: {
      facebookId: "FirebaseId",
    },
    vendors: {
      vendorId: "Vendor"
    },
    purchasedBevegrams: {
      firebaseId: {
        summary: "PurchasedBevegramSummary",
        list: {
          "FirebaseUniqueTimeSortableId": "PurchasedBevegram",
        }
      }
    },
    sentBevegrams: {
      firebaseId: {
        summary: "SentBevegramSummary",
        list: {
          "FirebaseUniqueTimeSortableId": "SentBevegram",
        }
      }
    },
    receivedBevegrams: {
      firebaseId: {
        summary: "ReceivedBevegramSummary",
        list: {
          "FirebaseUniqueTimeSortableId": "ReceivedBevegram",
        }
      }
    },
    redeemedBevegrams: {
      vendors: {
        vendorId: {
          // Any user can write to any vendors ledger
          ledger: {
            bevegramList: {
              "FirebaseUniqueTimeSortableId": "RedeemedBevegram",
            },
            customerList: {
              // A user may only write to their firebaseId
              firebaseId: true,
            }
          }
        },
      },
      users: {
        firebaseId: {
          "FirebaseUniqueTimeSortableId": "RedeemedBevegram"
        }
      }
    }
  }
}

export const GetSchemaDbUrl = (table: string, key: string | Object): string => {
  const urlSeparator = "/";
  const periodsRe = /\./g;

  // Check if the table exists in the Schema
  if(_.has(Schema, ["root", table].join("."))){

    // If `key` is an object, replace the the object key in table with the
    // object value
    if(typeof key === "object"){
      let newTable = table;
      Object.keys(key).map((k) => {
        newTable = newTable.replace(k, key[k]);
      })
      return newTable.replace(periodsRe, urlSeparator)
    }

    return [table, key.replace(periodsRe, urlSeparator)].join(urlSeparator);
  }

  throw Error(`Db Error: Key "${key}" does not exist within table ${table}!`);
}

export const GetUserDbUrl = (firebaseId: string) => {
  return GetSchemaDbUrl("users", firebaseId);
}

export const GetVendorDbUrl = (vendorId: string) => {
  return GetSchemaDbUrl("vendors", vendorId);
}

export const GetFacebookIdDbUrl = (facebookId: string) => {
  return GetSchemaDbUrl("firebaseIds.facebookId", {facebookId: facebookId});
}

export const GetPurchasedBevegramListDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("purchasedBevegrams.firebaseId.list", {firebaseId: firebaseId});
}

export const GetPurchasedBevegramSummaryDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("purchasedBevegrams.firebaseId.summary", {firebaseId: firebaseId});
}

export const GetSentBevegramListDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("sentBevegrams.firebaseId.list", {firebaseId: firebaseId});
}

export const GetSentBevegramSummaryDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("sentBevegrams.firebaseId.summary", {firebaseId: firebaseId});
}

export const GetReceivedBevegramListDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("receivedBevegrams.firebaseId.list", {firebaseId: firebaseId});
}

export const GetReceivedBevegramSummaryDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("receivedBevegrams.firebaseId.summary", {firebaseId: firebaseId});
}

export const GetRedeemedBevegramVendorDbUrl = (vendorId: string): string => {
  return GetSchemaDbUrl("redeemedBevegrams.vendorId.ledger.bevegramList", {vendorId: vendorId});
}

export const GetRedeemedBevegramVendorCustomerDbUrl = (vendorId: string): string => {
  return GetSchemaDbUrl("redeemedBevegrams.vendorId.ledger.customerList", {vendorId: vendorId});
}

export const GetRedeemedBevegramUserDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("redeemedBevegrams.users.firebaseId", {firebaseId: firebaseId});
}
