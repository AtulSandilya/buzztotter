const initialPurchaseState = {
  attempting: false,
  paymentMethod: undefined,
  creditCardVerified: undefined, // three values undef, true, false
  confirmed: undefined,
  failed: false,
  failMessage: "",
  data: {},
};

export const purchase = (state = initialPurchaseState, action) => {
  switch(action.type){
    case 'ATTEMPING_CREDIT_CARD_PURCHASE':
      return Object.assign({}, state,
        {
          paymentMethod: 'creditCard',
          attempting: true,
        }
      );
    case 'HANDLE_CREDIT_CARD_VERIFIED':
      return Object.assign({}, state,
        {
          creditCardVerified: true,
          data: action.payload,
        }
      );
    case 'HANDLE_CREDIT_CARD_VERIFICATION_FAILED':
      return Object.assign({}, state,
        {
          creditCardVerified: false,
          failed: true,
          failMessage: action.payload,
        }
      );
    case 'HANDLE_CREDIT_CARD_PURCHASE_SUCESSFUL':
      return Object.assign({}, state,
        {
          confirmed: true,
        }
      );
    case 'HANDLE_CREDIT_CARD_PURCHASE_FAILED':
      return Object.assign({}, state,
        {
          confirmed: false,
          failed: true,
          failMessage: action.payload,
        }
      );
    case 'HANDLE_CREDIT_CARD_FAILED':
      return Object.assign({}, state,
        {
          failed: true,
          // Only update failMessage if there is no message, other messages are
          // more specific
          failMessage: state.failMessage.length > 0 ? state.failMessage : action.payload,
        }
      );
    case 'END_CREDIT_CARD_PURCHASE':
    case 'RESET_CREDIT_CARD_PURCHASE':
      // Reset everything
      return initialPurchaseState;
    default:
      return state;
  }
}
