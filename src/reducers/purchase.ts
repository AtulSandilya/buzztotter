import { PurchasePackage, PurchaseTransactionStatus } from "../db/tables";
import PurchasePackages from "../staticDbContent/PurchasePackages";

export interface PurchaseState {
  attemptingPurchase: boolean;
  attemptingSend: boolean; // tristate
  completedSend: boolean;
  paymentMethod: string;
  confirmed: boolean; // tristate
  failed: boolean;
  isRefreshingUser: boolean;
  failMessage: string;
  attemptingStripeUpdate: boolean;
  purchasePackages: PurchasePackage[];
  purchaseTransactionStatus: PurchaseTransactionStatus;
  selectedPurchasePackageIndex: number;
}

/* tslint:disable:object-literal-sort-keys */
const startingPurchaseTransactionStatus: PurchaseTransactionStatus = {
  connectionEstablished: "pending",
  creditCardTransaction: "pending",
  updatingDatabase: "pending",
  sendingNotification: "pending",
};

export const initialPurchaseState: PurchaseState = {
  attemptingPurchase: false,
  attemptingSend: undefined,
  attemptingStripeUpdate: false,
  completedSend: false,
  confirmed: undefined,
  failMessage: "",
  failed: false,
  isRefreshingUser: false,
  paymentMethod: undefined,
  purchasePackages: PurchasePackages,
  purchaseTransactionStatus: startingPurchaseTransactionStatus,
  selectedPurchasePackageIndex: 0,
};

export const purchase = (state = initialPurchaseState, action) => {
  switch (action.type) {
    case "ATTEMPTING_CREDIT_CARD_PURCHASE":
      return {
        ...state,
        paymentMethod: "creditCard",
        attemptingPurchase: true,
      };
    case "SUCCESSFUL_CREDIT_CARD_PURCHASE":
      return {
        ...state,
        confirmed: true,
      };
    case "FAILED_CREDIT_CARD_PURCHASE":
      return {
        ...state,
        confirmed: false,
        failed: true,
        failMessage: action.payload.error,
      };
    case "HANDLE_CREDIT_CARD_FAILED":
      return {
        ...state,
        failed: true,
        // Only update failMessage if there is no message, other messages are
        // more specific
        failMessage:
          state.failMessage.length > 0
            ? state.failMessage
            : action.payload.error,
      };
    case "ATTEMPTING_STRIPE_DEFAULT_CARD_UPDATE":
      return {
        ...state,
        attemptingStripeUpdate: true,
      };
    case "RENDER_SUCCESSFUL_STRIPE_DEFAULT_CARD_UPDATE":
    case "RENDER_FAILED_STRIPE_DEFAULT_CARD_UPDATE":
      return {
        ...state,
        attemptingStripeUpdate: false,
      };
    case "ATTEMPTING_STRIPE_REMOVE_CARD":
      return {
        ...state,
        attemptingStripeUpdate: true,
      };
    case "RENDER_SUCCESSFUL_STRIPE_REMOVE_CARD":
    case "RENDER_FAILED_STRIPE_REMOVE_CARD":
      return {
        ...state,
        attemptingStripeUpdate: false,
      };
    case "END_CREDIT_CARD_PURCHASE_IF_NOT_ATTEMPTING":
      if (state.attemptingPurchase && state.confirmed !== true) {
        return state;
      } else {
        return initialPurchaseState;
      }
    case "END_CREDIT_CARD_PURCHASE":
    case "RESET_CREDIT_CARD_PURCHASE":
      // Reset everything
      return initialPurchaseState;
    case "SELECT_PURCHASE_PACKAGE":
      return {
        ...state,
        selectedPurchasePackageIndex:
          action.payload.newSelectedPurchasePackageIndex,
      };
    case "ATTEMPTING_SEND_BEVEGRAM":
      return {
        ...state,
        attemptingSend: true,
      };
    case "COMPLETED_SEND_BEVEGRAM":
      return {
        ...state,
        completedSend: true,
      };
    case "ATTEMPTING_USER_REFRESH_FOR_PURCHASE":
      return {
        ...state,
        attemptingStripeUpdate: true,
        isRefreshingUser: true,
      };
    case "COMPLETED_USER_REFRESH_FOR_PURCHASE":
      return {
        ...state,
        attemptingStripeUpdate: false,
        isRefreshingUser: false,
      };
    case "UPDATE_PURCHASE_PACKAGES":
      return {
        ...state,
        purchasePackages: action.payload.purchasePackages,
      };
    case "UPDATE_PURCHASE_TRANSACTION_STATUS":
      if (action.payload.error && !action.payload.data) {
        const newPurchaseTransactionStatus: PurchaseTransactionStatus = {
          ...state.purchaseTransactionStatus,
          error: action.payload.error,
        };

        return {
          ...state,
          purchaseTransactionStatus: {
            newPurchaseTransactionStatus,
          },
        };
      }

      return {
        ...state,
        purchaseTransactionStatus: action.payload.data,
      };
    case "FAILED_PURCHASE_TRANSACTION":
      const purchaseTransactionStatus = {
        ...state.purchaseTransactionStatus,
        error: action.payload.error,
      };
      return {
        ...state,
        purchaseTransactionStatus,
      };
    default:
      return state;
  }
};
