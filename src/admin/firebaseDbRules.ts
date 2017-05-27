import {
  User,
} from "../db/tables";
//
// Typescript structure from
// https://gist.github.com/blaugold/6e92b1b04af36e0525feef465c762137
interface DatabaseRuleSet {
  ".read"?: string | boolean;
  ".write"?: string | boolean;
  ".validate"?: string | boolean;
  ".indexOn"?: string | string[];
}

// Union types of objects do not work as types for properties
// 16 levels since firebase allows max of 16 levels
type RulesOf<A> = {
  [B in keyof A]?: {
  [C in keyof A[B]]?: {
  [D in keyof A[B][C]]?: {
  [E in keyof A[B][C][D]]?: {
  [F in keyof A[B][C][D][E]]?: {
  [G in keyof A[B][C][D][E][F]]?: {
  [H in keyof A[B][C][D][E][F][G]]?: {
  [I in keyof A[B][C][D][E][F][G][H]]?: {
  [J in keyof A[B][C][D][E][F][G][H][I]]?: {
  [K in keyof A[B][C][D][E][F][G][H][I][J]]?: {
  [L in keyof A[B][C][D][E][F][G][H][I][J][K]]?: {
  [M in keyof A[B][C][D][E][F][G][H][I][J][K][L]]?: {
  [N in keyof A[B][C][D][E][F][G][H][I][J][K][L][M]]?: {
  [O in keyof A[B][C][D][E][F][G][H][I][J][K][L][M][N]]?: {
  [P in keyof A[B][C][D][E][F][G][H][I][J][K][L][M][N][O]]?: DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet
  } & DatabaseRuleSet;

interface DatabaseRules<Schema> {
  rules: RulesOf<Schema>;
}

// TODO: Create verify this schema against the actual schema
// TODO: Separate client and server schema
export interface DatabaseSchema {
  users: {
    [firebaseUserId: string]: User,
  };
  purchasedBevegrams: object;
  sentBevegrams: object;
  receivedBevegrams: object;
  redeemedBevegrams: object;
  addCreditCardToCustomerQueue: object;
  removeCreditCardFromCustomerQueue: object;
  updateDefaultCreditCardQueue: object;
  purchaseQueue: object;
  redeemQueue: object;
  purchaseTransactionStatus: object;
  redeemTransactionStatus: object;
  firebaseIds: object;
  fcmTokens: object;
  allLocations: object;
  locationsByDegree: object;
  locationsByTenthOfDegree: object;
  locationsByHundrethOfDegree: object;
  purchasePackages: object;
  userVerificationTokens: object;
}

// Sample Stripe Token: tok_189gDz2eZvKYlo2CPdDOY16w
const stripeQueueValidateRule = "newData.hasChildren(['stripeCardId', 'userFirebaseId', 'verificationToken'])"
  + " && newData.child('stripeCardId').isString()"
  + " && newData.child('userFirebaseId').isString()"
  + " && newData.child('verificationToken').isString()";

/* tslint:disable:object-literal-sort-keys */
const stripeQueueRule = {
  ".read": false,
  ".write": "auth !== null",
  ".validate": stripeQueueValidateRule,
  ".indexOn": "_state",
};

// uid is the users firebase id
export const rules: DatabaseRules<DatabaseSchema> = {
  rules: {
    users: {
      $uid: {
        ".read": "auth.uid === $uid",
        ".write": "auth.uid === $uid",
      },
    },

    purchasedBevegrams: {$uid: {".read": "auth.uid === $uid", ".write": false}},
    sentBevegrams: {$uid: {".read": "auth.uid === $uid", ".write": false}},
    receivedBevegrams: {$uid: {".read": "auth.uid === $uid", ".write": false}},
    redeemedBevegrams: {$uid: {".read": "auth.uid === $uid", ".write": false}},

    purchaseTransactionStatus: {$uid: {".read": "auth.uid === $uid", ".write": false}},
    redeemTransactionStatus: {$uid: {".read": "auth.uid === $uid", ".write": false}},

    fcmTokens: {".read": false, ".write": "auth !== null"},
    firebaseIds: {".read": false, ".write": "auth !== null"},
    userVerificationTokens: {$uid: {".read": false, ".write": "auth.uid === $uid"}},

    allLocations: {".read": "auth !== null", ".write": false},
    locationsByDegree: {".read": "auth !== null", ".write": false},
    locationsByTenthOfDegree: {".read": "auth !== null", ".write": false},
    locationsByHundrethOfDegree: {".read": "auth !== null", ".write": false},
    purchasePackages: {".read": "auth !== null", ".write": false},

    addCreditCardToCustomerQueue: {
      tasks: {
        $pushId: {
          ".read": false,
          ".write": "auth !== null",
          ".validate": "newData.hasChildren(['stripeCreditCardToken', 'userFirebaseId', 'verificationToken'])" +
          " && newData.child('userFirebaseId').isString()" +
          " && newData.child('verificationToken').isString()" +
          " && newData.child('stripeCreditCardToken').isString()" +
          " && newData.child('stripeCreditCardToken').val().beginsWith('tok_')" +
          " && newData.child('stripeCreditCardToken').val().length === 28",
          ".indexOn": "_state",
        },
      },
    },
    removeCreditCardFromCustomerQueue: {tasks: {$pushId: stripeQueueRule}},
    updateDefaultCreditCardQueue: {tasks: {$pushId: stripeQueueRule}},
    purchaseQueue: {
      tasks: {
        $pushId: {
          ".indexOn": "_state",
          ".read": false,
          ".write": "auth !== null",
          ".validate": "newData.hasChildren([" +
          "'userFirebaseId', 'receiverFacebookId', 'purchaseQuantity', 'purchasePrice', 'verificationToken'])"
          + " && newData.child('userFirebaseId').isString()"
          + " && newData.child('receiverFacebookId').isString()"
          + " && newData.child('purchaseQuantity').isNumber()"
          + " && newData.child('purchasePrice').isNumber()"
          + " && newData.child('verificationToken').isString()",
        },
      },
    },
    redeemQueue: {
      tasks: {
        $pushId: {
          ".indexOn": "_state",
          ".read": false,
          ".write": "auth !== null",
          ".validate": "newData.hasChildren([" +
          "'userFirebaseId', 'receivedId', 'location', 'quantity', 'verificationToken'])"
          + " && newData.child('userFirebaseId').isString()"
          + " && newData.child('receivedId').isString()"
          + " && newData.child('quantity').isNumber()"
          + " && newData.child('verificationToken').isString()",
        },
      },
    },
  },
};

export default rules;
