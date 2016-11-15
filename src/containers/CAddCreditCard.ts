import { connect } from 'react-redux';

import AddCreditCard, {AddCreditCardProps} from '../components/AddCreditCard';

import {CardDataForVerification} from '../reducers/addCreditCard';

interface AddCreditCardMap {
  attemptingVerification: boolean;
  isVerified: boolean;
  failed: boolean;
  failMessage: string;
}

const mapStateToProps = (state): AddCreditCardMap => {
  return {
    attemptingVerification: state.addCreditCard.attemptingVerification,
    isVerified: state.addCreditCard.isVerified,
    failed: state.addCreditCard.failed,
    failMessage: state.addCreditCard.failMessage,
  };
}

interface AddCreditCardDispatch {
  goBackToPurchase(): void;
  verifyCardDetailsWithStripe(cardData): void;
  verificationFailed(errorMessage): void;
}

const mapDispatchToProps = (dispatch): AddCreditCardDispatch => {
  return {
    goBackToPurchase: () => {
      dispatch({
        type: 'GO_BACK_ROUTE',
        payload: {
          route: "AddCreditCard",
          nextRoute: "PurchaseBeer",
          postActions: [{type: 'END_CREDIT_CARD_VERIFICATION_IF_NOT_ATTEMPTING'}],
        },
      });
    },
    verifyCardDetailsWithStripe: (cardData: CardDataForVerification)  => {
      dispatch({
        type: 'REQUEST_CREDIT_CARD_VERIFICATION',
        payload: {
          cardData: cardData,
        }
      })
    },
    verificationFailed: (errorMessage) => {
      dispatch({type: 'FAILED_CREDIT_CARD_VERIFICATION', payload: {
        error: errorMessage,
      }});
    }
  }
}

const CAddCreditCard = connect<AddCreditCardMap, AddCreditCardDispatch, AddCreditCardProps>(
  mapStateToProps,
  mapDispatchToProps,
)(AddCreditCard);

export default CAddCreditCard;
