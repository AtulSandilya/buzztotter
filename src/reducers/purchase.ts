export interface PurchaseData {
  amount: number;
  description: string;
}

export interface PurchaseState {
  pricePerDrink: number,
  attemptingPurchase: boolean,
  paymentMethod: string,
  confirmed: boolean; // tristate
  failed: boolean;
  failMessage: string;
  attemptingStripeUpdate: boolean;
}

export interface CardResponseData {
  token: string;
  brand: string;
  last4: string;
  id: string;
}

export const initialPurchaseState: PurchaseState = {
  pricePerDrink: 6.00,
  attemptingPurchase: false,
  paymentMethod: undefined,
  confirmed: undefined,
  failed: false,
  failMessage: "",
  attemptingStripeUpdate: false,
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
    default:
      return state;
  }
}
