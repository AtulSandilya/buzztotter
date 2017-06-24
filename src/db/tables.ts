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
  gender?: string;
  min_age?: number;
  lastModified?: UnixTime;
  fcmToken?: string;
  lastUserCoords?: GpsCoordinates;
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

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationViewport {
  northeast: GpsCoordinates;
  southwest: GpsCoordinates;
}

export const DEFAULT_SQUARE_FOOTAGE = 2000; // ~ 25 meters

// Pulled from the google maps place details api
export interface BasicLocation extends GpsCoordinates {
  name: string;
  address: string;
  phoneNumber: string;
  url: string;
  viewport: LocationViewport;
  googlePlaceId: string;
  typicalHours: string[];
  squareFootage?: number;
}

export interface Location extends BasicLocation {
  distanceFromUser?;
  vendorId?: string;
}

//  End Location --------------------------------------------------------}}}
//  Vendor -------------------------------------------------------------{{{

// None of this should touch the client
export interface Vendor extends Location {
  allowPurchasing: boolean;
  dateCreated: UnixTime;
  lastModified: number;
}

//  End Vendor ---------------------------------------------------------}}}
//  PurchasePackage -----------------------------------------------------{{{

export interface PurchasePackage {
  name: string;
  quantity: number;
  price: number;
}

//  End PurchasePackage -------------------------------------------------}}}
//  PurchaseActionData --------------------------------------------------{{{

export interface PurchaseActionData {
  price: number;
  quantity: number;
  promoCode: string;
}

//  End PurchaseActionData ----------------------------------------------}}}
//  SendActionData ------------------------------------------------------{{{

export interface SendActionData {
  recipentName: string;
  quantity: number;
  message: string;
  facebookId: string;
}

//  End SendActionData --------------------------------------------------}}}
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
  promoCode?: string;
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

export interface TransactionStatus {
  lastModified?: UnixTime;
  error?: string;
}

export interface PurchaseTransactionStatus extends TransactionStatus {
  connectionEstablished: EventStatus;
  creditCardTransaction: EventStatus;
  updatingDatabase: EventStatus;
  sendingNotification: EventStatus;
}

//  End PurchaseTransactionStatus --------------------------------------------------}}}
//  RedeemTransactionStatus --------------------------------------------{{{

export interface RedeemTransactionStatus extends TransactionStatus {
  connectionEstablished: EventStatus;
  updatingDatabase: EventStatus;
}

//  End RedeemTransactionStatus ----------------------------------------}}}
//  Sent Bevegram ------------------------------------------------------{{{

export const MESSAGE_MAX_CHARS = 1000;

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
  message?: string;
  isRedeemed: boolean;
  quantity: number;
  quantityRedeemed: number;
}

export interface ReceivedBevegramSummary {
  total: number;
  availableToRedeem: number;
  redeemed: number;
}

//  End ReceivedBevegram -----------------------------------------------}}}
//  RedeemedBevegram ----------------------------------------------------{{{

export interface UserRedeemedBevegram {
  receivedId: string;
  redeemedDate: UnixTime;
  vendorName: string;
  vendorPin: string;
  vendorId: string;
  quantity: number;
}

export interface UserRedeemedBevegramSummary {
  total: number;
  vendorList: string[];
}

export interface VendorRedeemedBevegram {
  receivedId: string;
  redeemedByName: string;
  redeemedByUserId: string;
  redeemedByPhotoUrl: string;
  redeemedDate: UnixTime;
  quantity: number;
}

//  End RedeemedBevegram ------------------------------------------------}}}
//  Notifications -------------------------------------------------------{{{

export interface NotificationPackage {
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
  purchaseQuantity: number;
  purchasePrice: number;
  verificationToken: string;
  promoCode?: string;
  message?: string;
}

export interface RedeemPackageForQueue {
  userFirebaseId: string;
  receivedId: string;
  location: Location;
  quantity: number;
  verificationToken: string;
}

export interface ToggleNotificationSettingPackageForQueue {
  userFirebaseId: string;
  verificationToken: string;
  fcmToken?: string;
}

//  End Queue -----------------------------------------------------------}}}
