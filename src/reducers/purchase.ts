export interface PurchaseData {
  amount: number;
  description: string;
  quantity: number;
}

export interface PurchaseState {
  attemptingPurchase: boolean;
  attemptingSend: boolean; // tristate
  completedSend: boolean;
  paymentMethod: string;
  confirmed: boolean; // tristate
  failed: boolean;
  failMessage: string;
  attemptingStripeUpdate: boolean;
  purchasePackages: PurchasePackage[];
  selectedPurchasePackageIndex: number;
}

export interface CardResponseData {
  token: string;
  brand: string;
  last4: string;
  id: string;
}

export interface PurchasePackage {
  name: string;
  quantity: number;
  price: number;
}

export const initialPurchaseState: PurchaseState = {
  attemptingPurchase: false,
  attemptingSend: undefined,
  completedSend: false,
  paymentMethod: undefined,
  confirmed: undefined,
  failed: false,
  failMessage: "",
  attemptingStripeUpdate: false,
  purchasePackages: [
    {
      name: "One",
      price: 7.50,
      quantity: 1,
    },
    {
      name: "Sixer (Six)",
      price: 37.50,
      quantity: 6,
    },
    {
      name: "Fourteener (14)",
      price: 82.50,
      quantity: 14,
    }
  ],
  selectedPurchasePackageIndex: 0,
};

export const purchase = (state = initialPurchaseState, action) => {
  switch(action.type){
    case 'ATTEMPTING_CREDIT_CARD_PURCHASE':
      console.log("ATTEMPTING_CREDIT_CARD_PURCHASE");
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
      return Object.assign({}, state, {
        attemptingStripeUpdate: false,
      });
    case 'ATTEMPTING_STRIPE_REMOVE_CARD':
      return Object.assign({}, state, {
        attemptingStripeUpdate: true,
      });
    case 'RENDER_SUCCESSFUL_STRIPE_REMOVE_CARD':
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
      console.log("Attempting Send");
      return Object.assign({}, state, {
        attemptingSend: true,
      });
    case 'COMPLETED_SEND_BEVEGRAM':
      console.log("Completed send");
      return Object.assign({}, state, {
        completedSend: true,
      });
    default:
      return state;
  }
}
