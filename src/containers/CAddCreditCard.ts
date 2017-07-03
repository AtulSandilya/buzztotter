import { connect } from "react-redux";

import AddCreditCard, { AddCreditCardProps } from "../components/AddCreditCard";

import { CardDataForVerification } from "../reducers/addCreditCard";

interface AddCreditCardMap {
  attemptingVerification: boolean;
  isVerified: boolean;
  failed: boolean;
  failMessage: string;
}

const mapStateToProps = (state): AddCreditCardMap => {
  return {
    attemptingVerification: state.addCreditCard.attemptingVerification,
    failMessage: state.addCreditCard.failMessage,
    failed: state.addCreditCard.failed,
    isVerified: state.addCreditCard.isVerified,
  };
};

interface AddCreditCardDispatch {
  goBackToPurchase(): void;
  verifyCardDetailsWithStripe(cardData): void;
  verificationFailed(errorMessage): void;
}

const mapDispatchToProps = (dispatch): AddCreditCardDispatch => {
  return {
    goBackToPurchase: () => {
      dispatch({ type: "GO_BACK_ROUTE" });
    },
    verificationFailed: errorMessage => {
      dispatch({
        type: "FAILED_CREDIT_CARD_VERIFICATION",
        payload: {
          error: errorMessage,
        },
      });
    },
    verifyCardDetailsWithStripe: (cardData: CardDataForVerification) => {
      dispatch({
        type: "REQUEST_CREDIT_CARD_VERIFICATION",
        payload: {
          cardData: cardData,
        },
      });
    },
  };
};

const CAddCreditCard = connect<
  AddCreditCardMap,
  AddCreditCardDispatch,
  AddCreditCardProps
>(mapStateToProps, mapDispatchToProps)(AddCreditCard);

export default CAddCreditCard;
