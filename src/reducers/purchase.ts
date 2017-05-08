import {
  PurchasePackage,
  PurchaseTransactionStatus,
} from "../db/tables";
import PurchasePackages from "../staticDbContent/PurchasePackages";

export interface PurchaseData {
  amount: number;
  description: string;
  quantity: number;
  promoCode: string;
}

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
  switch(action.type){
    case 'ATTEMPTING_CREDIT_CARD_PURCHASE':
      return Object.assign({}, state, {
          paymentMethod: 'creditCard',
          attemptingPurchase: true,
        });
    case 'SUCCESSFUL_CREDIT_CARD_PURCHASE':
      return Object.assign({}, state, {
          confirmed: true,
        });
    case 'FAILED_CREDIT_CARD_PURCHASE':
      return Object.assign({}, state, {
          confirmed: false,
          failed: true,
          failMessage: action.payload.error,
        });
    case 'HANDLE_CREDIT_CARD_FAILED':
      return Object.assign({}, state, {
          failed: true,
          // Only update failMessage if there is no message, other messages are
          // more specific
          failMessage: state.failMessage.length > 0 ? state.failMessage : action.payload.error,
        });
    case 'ATTEMPTING_STRIPE_DEFAULT_CARD_UPDATE':
      return Object.assign({}, state, {
        attemptingStripeUpdate: true,
      });
    case 'RENDER_SUCCESSFUL_STRIPE_DEFAULT_CARD_UPDATE':
    case 'RENDER_FAILED_STRIPE_DEFAULT_CARD_UPDATE':
      return Object.assign({}, state, {
        attemptingStripeUpdate: false,
      });
    case 'ATTEMPTING_STRIPE_REMOVE_CARD':
      return Object.assign({}, state, {
        attemptingStripeUpdate: true,
      });
    case 'RENDER_SUCCESSFUL_STRIPE_REMOVE_CARD':
    case 'RENDER_FAILED_STRIPE_REMOVE_CARD':
      return Object.assign({}, state, {
        attemptingStripeUpdate: false,
      });
    case 'END_CREDIT_CARD_PURCHASE_IF_NOT_ATTEMPTING':
      if(state.attemptingPurchase && (state.confirmed !== true)){
        return state;
      } else {
        return initialPurchaseState;
      }
    case 'END_CREDIT_CARD_PURCHASE':
    case 'RESET_CREDIT_CARD_PURCHASE':
      // Reset everything
      return initialPurchaseState;
    case 'SELECT_PURCHASE_PACKAGE':
      return Object.assign({}, state, {
        selectedPurchasePackageIndex: action.payload.newSelectedPurchasePackageIndex,
      });
    case 'ATTEMPTING_SEND_BEVEGRAM':
      return Object.assign({}, state, {
        attemptingSend: true,
      });
    case 'COMPLETED_SEND_BEVEGRAM':
      return Object.assign({}, state, {
        completedSend: true,
      });
    case "ATTEMPTING_USER_REFRESH_FOR_PURCHASE":
      return Object.assign({}, state, {
        attemptingStripeUpdate: true,
        isRefreshingUser: true,
      });
    case "COMPLETED_USER_REFRESH_FOR_PURCHASE":
      return Object.assign({}, state, {
        attemptingStripeUpdate: false,
        isRefreshingUser: false,
      })
    case "UPDATE_PURCHASE_PACKAGES":
      return Object.assign({}, state, {
        purchasePackages: action.payload.purchasePackages,
      });
    case "UPDATE_PURCHASE_TRANSACTION_STATUS":
      return Object.assign({}, state, {
        purchaseTransactionStatus: action.payload.purchaseTransactionStatus,
      });
    case "FAILED_PURCHASE_TRANSACTION":
      const purchaseTransactionStatus = Object.assign({}, state.purchaseTransactionStatus, {
        error: action.payload.error,
      });
      return Object.assign({}, state, {
        purchaseTransactionStatus,
      });
    default:
      return state;
  }
}
