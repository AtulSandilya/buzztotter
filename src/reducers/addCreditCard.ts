export interface CardDataForVerification {
  cardNumber: string;
  cardExpMonth: string;
  cardExpYear: string;
  cardCvc: string;
}

interface AddCreditCardState {
  attemptingVerification: boolean;
  isVerified: boolean;
  failed: boolean;
  failMessage: string;
}

const initialAddCreditCardState: AddCreditCardState = {
  attemptingVerification: false,
  failMessage: "",
  failed: false,
  isVerified: false,
};

export const addCreditCard = (state = initialAddCreditCardState, action) => {
  switch (action.type) {
    case "ATTEMPTING_CREDIT_CARD_VERIFICATION":
      return {
        ...state,
        attemptingVerification: true,
      };
    case "SUCCESSFUL_CREDIT_CARD_VERIFICATION":
      return {
        ...state,
        attemptingVerification: false,
        isVerified: true,
      };
    case "FAILED_STRIPE_ADD_CARD_TO_CUSTOMER":
    case "FAILED_CREDIT_CARD_VERIFICATION":
      return {
        ...state,
        attemptingVerification: false,
        failMessage: action.payload.error,
        failed: true,
      };
    case "THROWN_STRIPE_ADD_CARD_TO_CUSTOMER":
    case "THROWN_CREDIT_CARD_VERIFICATION":
      return {
        ...state,
        attemptingVerification: false,
        failMessage: state.failMessage.length > 0
          ? state.failMessage
          : action.payload.error,
        failed: true,
      };
    case "END_CREDIT_CARD_VERIFICATION_IF_NOT_ATTEMPTING":
      if (state.attemptingVerification) {
        return state;
      } else {
        return initialAddCreditCardState;
      }
    case "END_CREDIT_CARD_VERIFICATION":
      return initialAddCreditCardState;
    default:
      return state;
  }
};
