import { connect } from 'react-redux';

import PurchaseAndOrSendInProgress from '../components/PurchaseAndOrSendInProgress';


interface MapStateProps {
  // From State
  purchaseConfirmed: boolean;
  purchaseFailed: boolean;
  purchaseFailedMessage: string;
  sendConfirmed: boolean;
  // From route
  bevegramsUserIsSending: number;
  bevegramsUserIsPurchasing: number;
  bevegramsPurchasePrice: string;
  cardLast4: string,
  cardFontAwesomeIcon: string,
  userIsPurchasing: boolean;
  userIsSending: boolean;
  recipentFullName: string;
  buttonFontSize: number;
}

const mapStateToProps = (state): MapStateProps => {
  // Combine Route Data with other relevant data
  return Object.assign({}, state.routes.PurchaseAndOrSendInProgress.data, {
    purchaseConfirmed: state.purchase.confirmed,
    purchaseFailed: state.purchase.failed,
    purchaseFailedMessage: state.purchase.failMessage,
    sendConfirmed: state.purchase.completedSend,
  });
}

interface MapDispatchProps {
  closeRoute();
  resetPurchase();
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeRoute: () => {
      dispatch({type: 'GO_BACK_ROUTE'});
    },
    resetPurchase: () => {
      dispatch({type: 'RESET_CREDIT_CARD_PURCHASE'});
    }
  }
}

const CPurchaseAndOrSendInProgress = connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseAndOrSendInProgress);

export default CPurchaseAndOrSendInProgress;
