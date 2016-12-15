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
  purchaseDate: Date;
  id: string;
  transactionId: string;
  isSent: boolean;
  sentDate: Date;
}

//  End PurchasedBevegram -----------------------------------------------}}}
//  ReceivedBevegram ---------------------------------------------------{{{

export interface ReceivedBevegram {
  purchasedByName: string;
  purchasedById: string;
  purchasedByFacebookId: string;
  sentFromName: string;
  sentFromFacebookId: string;
  sentFromPhotoUrl: string;
  recievedDate: Date;
  message: string;
  isRedeemed: boolean;
}

//  End ReceivedBevegram -----------------------------------------------}}}
//  RedeemedBevegram ----------------------------------------------------{{{

export interface RedeemedBevegram {
  redeemedByName: string;
  redeemedByFacebookId: string;
  purchasedByName: string;
  purchasedById: string;
  purchasedByFacebookId: string;
  redeemedDate: Date;
  redeemedVendorPin: string;
}

//  End RedeemedBevegram ------------------------------------------------}}}
