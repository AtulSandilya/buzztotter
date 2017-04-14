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
  lastModified?: string;
  fcmToken?: string;
  stripe?: StripeCustomer;
  firebase?: FirebaseUser;
}

//  End User ------------------------------------------------------------}}}
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
//  PurchasedBevegram ---------------------------------------------------{{{

export interface PurchasedBevegram {
  purchasedByName: string;
  purchasedById: string;
  purchasedByFacebookId: string;
  purchaseDate: string;
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
//  Sent Bevegram ------------------------------------------------------{{{

export interface SentBevegram {
  purchasedBevegramId: string;
  quantity: number;
  sendDate: string;
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
  purchaseDate: string;
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
  promoCode: string;
  message: string;
  verificationToken: string;
}

export interface RedeemPackageForQueue {
  userFirebaseId: string;
  redeemId: string;
  locationId: string;
  verificationToken: string;
}

//  End Queue -----------------------------------------------------------}}}
