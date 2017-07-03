import { connect } from "react-redux";

import { PurchaseTransactionStatus } from "../db/tables";

import PurchaseAndOrSendInProgress from "../components/PurchaseAndOrSendInProgress";

interface MapStateProps {
  // From State
  purchaseTransactionStatus: PurchaseTransactionStatus;
  // From route
  bevegramsUserIsSending: number;
  bevegramsUserIsPurchasing: number;
  bevegramsPurchasePrice: string;
  cardLast4: string;
  cardFontAwesomeIcon: string;
  userIsPurchasing: boolean;
  userIsSending: boolean;
  recipentFullName: string;
  recipentImage: string;
  buttonFontSize: number;
}

const mapStateToProps = (state): MapStateProps => {
  // Combine Route Data with other relevant data
  return {
    ...state.routes.PurchaseInProgress.data,
    ...state.routes.SendInProgress.data,
    purchaseTransactionStatus: state.purchase.purchaseTransactionStatus,
  };
};

interface MapDispatchProps {
  closeRoute();
  resetPurchase();
}

const mapDispatchToProps = dispatch => {
  return {
    closeRoute: () => {
      dispatch({ type: "GO_BACK_ROUTE" });
    },
    resetPurchase: () => {
      dispatch({ type: "RESET_CREDIT_CARD_PURCHASE" });
    },
  };
};

const CPurchaseAndOrSendInProgress = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PurchaseAndOrSendInProgress);

export default CPurchaseAndOrSendInProgress;
