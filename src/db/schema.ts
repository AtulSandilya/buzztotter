import {
  FormatGpsCoordinates,
} from "../CommonUtilities";

import {
  GpsCoordinates,
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
    purchaseTransactionStatus: {
      userFirebaseId: "PurchaseTransactionStatus",
    },
    redeemTransactionStatus: {
      userFirebaseId: "RedeemTransactionStatus",
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
      firebaseId: {
        summary: "RedeemedBevegramsSummary",
        list: {
          uniqueId: "RedeemedBevegram",
        },
      },
    },
    allLocations: {
      summary: {
        totalLocations: "number",
        },
      list: {
        vendorId: "Location",
      },
    },
    // ~69 mile square area
    locationsByDegree: {
      summary: {
        totalLocations: "number",
      },
      latitudeInDegrees: {
        longitudeInDegrees: {
          summary: {
            totalLocations: "number",
          },
          list: {
            vendorId: "Location",
          },
        },
      },
    },
    // ~6.9 mile square area
    locationsByTenthOfDegree: {
      summary: {
        totalLocations: "number",
      },
      latitudeInTenthOfDegrees: {
        longitudeInTenthOfDegrees: {
          summary: {
            totalLocations: "number",
          },
          list: {
            id: "Location",
          },
        },
      },
    },
    // ~0.69 mile square area
    locationsByHundrethOfDegree: {
      summary: {
        totalLocations: "number",
      },
      latitudeInHundrethOfDegrees: {
        longitudeInHundrethOfDegrees: {
          summary: {
            totalLocations: "number",
          },
          list: {
            vendorId: "Location",
          },
        },
      },
    },
    vendors: {
      vendorId: {
        // These fields are for querying and sorting
        name: "string",
        address: "string",
        latitude: "string",
        longitude: "string",
        metadata: "Vendor",
        list: {
          pushId: "RedeemedBevegram",
        },
      },
    },
  },
};

const has = (obj: object, key: string): any => {
  let newObj = Object.assign({}, obj);
  key.split(".").map((k) => {
    if (newObj) {
      newObj = newObj[k];
    }
  });
  return newObj;
};

export const GetSchemaDbUrl = (table: string, keysToReplace?: string | any): string => {
  const urlSeparator = "/";
  const periodsRe = /\./g;

  // Check if the table exists in the Schema
  try {
    const tableIsValid = has(Schema, "root." + table);
    if (tableIsValid === undefined) {
      throw Error;
    }
  } catch (e) {
    throw Error(`Db Error: Key "${JSON.stringify(keysToReplace)}" does not exist within the database schema!`);
  }

  if (!keysToReplace) {
    return table.replace(periodsRe, urlSeparator);
  } else if (typeof keysToReplace === "object") {
    const invalidKeyChars = {
      "\\.": "_",
      "\\#": "!",
      "\\$": "?",
      "\\[": "{",
      "\\]": "}",
    };

    let newTable = table.replace(periodsRe, urlSeparator);

    Object.keys(keysToReplace).map((k) => {
      newTable = newTable.replace(k, keysToReplace[k]);
    });

    Object.keys(invalidKeyChars).map((key) => {
      const regex = new RegExp(key, "g");
      newTable = newTable.replace(regex, invalidKeyChars[key]);
    });

    return newTable;
  } else {
    return [table, keysToReplace.replace(periodsRe, urlSeparator)].join(urlSeparator);
  }
};

export const GetUserDbUrl = (firebaseId: string) => {
  return GetSchemaDbUrl("users", firebaseId);
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

export const GetRedeemedBevegramListDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("redeemedBevegrams.firebaseId.list", {firebaseId});
};

export const GetRedeemedBevegramSummaryDbUrl = (firebaseId: string): string => {
  return GetSchemaDbUrl("redeemedBevegrams.firebaseId.summary", {firebaseId});
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

export const GetPurchaseTransactionStatusDbUrl = (userFirebaseId: string): string => {
  return GetSchemaDbUrl("purchaseTransactionStatus.userFirebaseId", {userFirebaseId});
};

export const GetRedeemTransactionStatusDbUrl = (userFirebaseId: string): string => {
  return GetSchemaDbUrl("redeemTransactionStatus.userFirebaseId", {userFirebaseId});
};

export const GetVendorPushDbUrl = () => {
  return GetSchemaDbUrl("vendors");
};

export const GetVendorDbUrl = (vendorId: string) => {
  return GetSchemaDbUrl("vendors.vendorId", {vendorId: vendorId});
};

export const GetVendorMetadataDbUrl = (vendorId: string) => {
  return GetSchemaDbUrl("vendors.vendorId.metadata", {vendorId: vendorId});
};

export const GetVendorRedeemListDbUrl = (vendorId: string) => {
  return GetSchemaDbUrl("vendors.vendorId.list", {vendorId});
};

/* tslint:disable:no-magic-numbers */
export const GetLocationByDegreeUrl = (
  lat: string,
  long: string,
  listOrSummary: "list" | "summary",
  decimalPlaces: number,
): string => {
  switch (decimalPlaces) {
    case 0:
      return GetSchemaDbUrl(
        "locationsByDegree.latitudeInDegrees.longitudeInDegrees." + listOrSummary,
        {latitudeInDegrees: lat, longitudeInDegrees: long},
      );
    case 1:
      return GetSchemaDbUrl(
        "locationsByTenthOfDegree.latitudeInTenthOfDegrees.longitudeInTenthOfDegrees." + listOrSummary,
        {latitudeInTenthOfDegrees: lat, longitudeInTenthOfDegrees: long},
      );
    case 2:
      return GetSchemaDbUrl(
        "locationsByHundrethOfDegree.latitudeInHundrethOfDegrees.longitudeInHundrethOfDegrees." + listOrSummary,
        {latitudeInHundrethOfDegrees: lat, longitudeInHundrethOfDegrees: long},
      );
    default:
      console.error("Invalid decimal place");
  }
};

export const GetGpsCoordNodeFullSummaryUrl = (decimalPlaces: number) => {
  switch (decimalPlaces) {
    default:
    case 0:
      return GetSchemaDbUrl("locationsByDegree.summary");
    case 1:
      return GetSchemaDbUrl("locationsByTenthOfDegree.summary");
    case 2:
      return GetSchemaDbUrl("locationsByHundrethOfDegree.summary");
  }
};

export const GetAllGpsCoordNodeUrls = (gpsCoords: GpsCoordinates): Array<{listUrl: string, summaryUrl: string}> => {
  const gpsCoordNodeDataList = [
    {decimalPlace: 0},
    {decimalPlace: 1},
    {decimalPlace: 2},
  ];

  const list = gpsCoordNodeDataList.map((gpsCoordNodeData) => {
    const formattedCoords = FormatGpsCoordinates(gpsCoords, gpsCoordNodeData.decimalPlace);
    return {
      listUrl: GetLocationByDegreeUrl(
        formattedCoords.latitude,
        formattedCoords.longitude,
        "list",
        gpsCoordNodeData.decimalPlace,
      ),
      summaryUrl: GetLocationByDegreeUrl(
        formattedCoords.latitude,
        formattedCoords.longitude,
        "summary",
        gpsCoordNodeData.decimalPlace,
      ),
    };
  });
  list.unshift({
    listUrl: GetSchemaDbUrl("allLocations.list"),
    summaryUrl: GetSchemaDbUrl("allLocations.summary"),
  });

  // Order from least -> most specific
  return list;
};
