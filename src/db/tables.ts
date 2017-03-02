//  User ----------------------------------------------------------------{{{

export interface User {
  userId: string;
  userType: "user" | "vendor" | "admin";
  firstName: string;
  lastName: string;
  email: string;
  createdDate: Date;
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
}

export interface SentBevegramSummary {
  availableToSend: number;
  sent: number,
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