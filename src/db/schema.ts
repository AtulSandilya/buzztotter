import uuid from 'react-native-uuid';

import {
  PurchasedBevegram,
  ReceivedBevegram,
  RedeemedBevegram,
  User,
  Vendor,
} from "./tables";

const Tables = {
  Root: 'root',
  Users: 'users',
  Vendors: 'vendors',
  PurchasedBevegrams: 'purchasedBevegrams',
  ReceivedBevegrams: 'receivedBevegrams',
  RedeemedBevegrams: 'redeemedBevegrams',
}

// This is what the firebase database looks like
interface Schema {
  root: {
    users: {
      firebaseId: User
    },
    vendors: {
      vendorId: Vendor
    },
    purchasedBevegrams: {
      firebaseId: {
        "UnixTime-id": PurchasedBevegram,
      }
    },
    receivedBevegrams: {
      facebookId: {
        "UnixTime-id": ReceivedBevegram,
      }
    },
    redeemedBevegrams: {
      vendorId: {
        // It is probably a bad idea to let any authenticated client write to
        // any vendors bevegrams, but this allows easy time sorting of
        // redeemed bevegrams.
        "UnixTime-id": RedeemedBevegram,
      }
    }
  }
}

const GetSchemaDbUrl = (table: string, keys: string[]): string => {
  // Add table to the beginning of the array
  return [table].concat(keys).join("/");
}

interface DbUrlWithId {
  url: string;
  unixTimeId: string;
}

export const CreateUnixTimeId = () => {
  return [Date.now().toString(), uuid.v4()].join("-");
}

const GetSchemaDbUrlWithId = (table: string, keys: string[]): DbUrlWithId => {
  const unixTimeId = CreateUnixTimeId();
  return {
    // Add Id to end of url.
    url: GetSchemaDbUrl(table, keys.concat([unixTimeId])),
    unixTimeId: unixTimeId,
  }
}

export const GetUserDbUrl = (firebaseId: string) => {
  return GetSchemaDbUrl(Tables.Users, [firebaseId]);
}

export const GetVendorDbUrl = (vendorId: string) => {
  return GetSchemaDbUrl(Tables.Vendors, [vendorId]);
}

export const GetPurchasedBevegramDbUrl = (firebaseId: string): DbUrlWithId => {
  return GetSchemaDbUrlWithId(Tables.PurchasedBevegrams, [firebaseId]);
}

export const GetReceivedBevegramDbUrl = (facebookId: string): DbUrlWithId => {
  return GetSchemaDbUrlWithId(Tables.ReceivedBevegrams, [facebookId]);
}

export const GetRedeemedBevegramDbUrl = (vendorId: string): DbUrlWithId => {
  return GetSchemaDbUrlWithId(Tables.RedeemedBevegrams, [vendorId]);
}
