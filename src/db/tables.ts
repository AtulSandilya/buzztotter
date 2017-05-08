//  Types ---------------------------------------------------------------{{{

export type UnixTime = number;

//  End Types -----------------------------------------------------------}}}
//  User ----------------------------------------------------------------{{{

export interface FirebaseUser {
  displayName: string;
  email: string;
  emailVerified: boolean;
  photoURL: string;
  refreshToken: string;
  uid: string;
}

export interface User {
  isLoggedIn: boolean;
  facebook?: {token: string, id: string};
  firstName?: string;
  lastName?: string;
  fullName?: string;
  birthday?: string;
  email?: string;
  lastModified?: UnixTime;
  fcmToken?: string;
  stripe?: StripeCustomer;
  firebase?: FirebaseUser;
}

//  End User ------------------------------------------------------------}}}
//  Stripe ------------------------------------------------------{{{

// Reasoning:
// 1. Is the max number of cards stripe returns in one "page" requiring
// pagination on the server resulting is slower api calls.
// 2. A typical user should only have a handful of credit cards anyway.
export const STRIPE_MAX_NUMBER_OF_CREDIT_CARDS = 10;

// For security reasons we store the mimimal amount of stripe data on the
// client. If necessary we can retrieve details from stripe from the backend.
export interface StripeCustomer {
  activeCardId?: string; // An actual stripe id
  creditCards?: StripeCreditCard[];
  error?: string;
}

export interface StripeCreditCard {
  brand: string;
  id: string; // Actual stripe ids
  last4: string;
  metadata?: any;
}

//  End Stripe--------------------------------------------------}}}
//  Location ------------------------------------------------------------{{{

export interface Location {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  typicalHours: string;
  squareFootage?: string;
}

//  End Location --------------------------------------------------------}}}
//  Vendor -------------------------------------------------------------{{{

export interface Vendor {
  vendorId: string;
  businessName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: number;
  phoneNumber: string;
  url: string;
}

//  End Vendor ---------------------------------------------------------}}}
//  PurchasePackage -----------------------------------------------------{{{

export interface PurchasePackage {
  name: string;
  quantity: number;
  price: number;
}

//  End PurchasePackage -------------------------------------------------}}}
//  PurchasedBevegram ---------------------------------------------------{{{

export interface PurchasedBevegram {
  purchasedByName: string;
  purchasedById: string;
  purchasedByFacebookId: string;
  purchaseDate: UnixTime;
  // Stripe id for this transaction
  chargeId: string;
  quantity: number;
  // In cents
  purchasePrice: number;
  // Used on credit card statement.
  description: string;
  promoCode: string;
  sentBevegramId?: string;
}

export interface PurchasedBevegramSummary {
  quantityPurchased: number;
  availableToSend: number;
  sent: number;
}

//  End PurchasedBevegram -----------------------------------------------}}}
//  PurchaseTransactionStatus ------------------------------------------------------{{{

export type EventStatus = "pending" | "inProgress" | "complete" | "failed";

export interface PurchaseTransactionStatus {
  connectionEstablished: EventStatus;
  creditCardTransaction: EventStatus;
  updatingDatabase: EventStatus;
  sendingNotification: EventStatus;
  lastModified?: UnixTime;
  error?: string;
}

//  End PurchaseTransactionStatus --------------------------------------------------}}}
//  Sent Bevegram ------------------------------------------------------{{{

export interface SentBevegram {
  purchasedBevegramId: string;
  quantity: number;
  sendDate: UnixTime;
  receiverName: string;
}

export interface SentBevegramSummary {
  availableToSend: number;
  sent: number;
}

//  End Sent Bevegram --------------------------------------------------}}}
//  ReceivedBevegram ---------------------------------------------------{{{

export interface ReceivedBevegram {
  // purchasedByName: string;
  // purchasedById: string;
  // purchasedByFacebookId: string;
  sentFromName: string;
  sentFromFacebookId: string;
  sentFromPhotoUrl: string;
  receivedDate: UnixTime;
  receivedDate: string;
  message: string;
  isRedeemed: boolean;
  quantity: number;
}

export interface ReceivedBevegramSummary {
  total: number;
  availableToRedeem: number;
  redeemed: number;
}

//  End ReceivedBevegram -----------------------------------------------}}}
//  RedeemedBevegram ----------------------------------------------------{{{

export interface RedeemedBevegram {
  redeemedByName: string;
  redeemedByFacebookId: string;
  redeemedByPhotoUrl: string;
  redeemedDate: string;
  vendorName: string;
  vendorPin: string;
  vendorId: string;
  quantity: number;
}

//  End RedeemedBevegram ------------------------------------------------}}}
//  Notifications -------------------------------------------------------{{{

export interface Notification {
  receiverGCMId: string;
  title: string;
  body: string;
  icon: string;
  action: string;
  data: any;
}

export const NotificationActions = {
  ShowNewReceivedBevegrams: "SHOW_NEW_RECEIVED_BEVEGRAMS",
  ShowUpcomingBirthdays: "SHOW_UPCOMING_BIRTHDAYS",
};

//  End Notifications ---------------------------------------------------}}}
//  PromoCodePackage ----------------------------------------------------------{{{

export interface PromoCodePackage {
  purchasedByUserId: string;
  purchaseDate: UnixTime;
  quantity: number;
}

//  End PromoCodePackage ------------------------------------------------------}}}
//  Queue ---------------------------------------------------------------{{{

export interface AddCreditCardToCustomerPackageForQueue {
  stripeCreditCardToken: string;
  userFirebaseId: string;
  verificationToken: string;
}

export interface RemoveCreditCardFromCustomerPackageForQueue {
  stripeCardId: string;
  userFirebaseId: string;
  verificationToken: string;
}

export interface UpdateDefaultCreditCardForCustomerPackageForQueue {
  stripeCardId: string;
  userFirebaseId: string;
  verificationToken: string;
}

export interface PurchasePackageForQueue {
  userFirebaseId: string;
  receiverFacebookId: string;
  purchaseQuantity: string;
  verificationToken: string;
  promoCode?: string;
  message?: string;
}

export interface RedeemPackageForQueue {
  userFirebaseId: string;
  redeemId: string;
  locationId: string;
  verificationToken: string;
}

//  End Queue -----------------------------------------------------------}}}
