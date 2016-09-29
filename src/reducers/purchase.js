const initialPurchaseState = {
  // Shows a processing view
  // Shows the verification view pending
  attempting: false,
  paymentMethod: undefined,
  creditCardVerified: undefined, // three values undef, true, false
  confirmed: undefined,
}

export const purchase = (state = initialPurchaseState, action) => {
  switch(action.type){
    case 'ATTEMPING_CREDIT_CARD_PURCHASE':
      return {...state,
        paymentMethod: 'creditCard',
        attempting: true,
    };
    case 'HANDLE_CREDIT_CARD_VERIFIED':
      return {...state,
        creditCardVerified: true
    }
    case 'HANDLE_CREDIT_CARD_VERIFICATION_FAILED':
      return {...state,
        creditCardVerified: false
    }
    case 'HANDLE_CREDIT_CARD_PURCHASE_SUCESSFUL':
      return {...state,
        confirmed: true,
    };
    case 'HANDLE_CREDIT_CARD_PURCHASE_FAILED':
      return {...state,
        confirmed: false,
    };
    case 'ENDING_CREDIT_CARD_PURCHASE':
      // Reset everything
      return initialPurchaseState;
    default:
      return state;
  }
}
