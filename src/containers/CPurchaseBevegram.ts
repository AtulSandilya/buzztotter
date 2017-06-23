import { connect } from "react-redux";

import PurchaseBevegram from "../components/PurchaseBevegram";

/* tslint:disable:object-literal-sort-keys */
const mapStateToProps = state => {
  const routeData = {
    ...state.routes.PurchaseBevegram.data,
    ...state.routes.SendBevegram.data,
  };

  return {
    fullName: state.routes.SendBevegram.data.fullName,
    firstName: state.routes.SendBevegram.data.firstName,
    isRefreshing: state.purchase.isRefreshingUser,
    imageUri: state.routes.SendBevegram.data.imageUri,
    facebookId: state.routes.SendBevegram.data.facebookId,
    purchase: state.purchase,
    creditCards: state.user.stripe ? state.user.stripe.creditCards : [],
    activeCardId: state.user.stripe
      ? state.user.stripe.activeCardId
      : undefined,
    attemptingUpdate: state.purchase.attemptingStripeUpdate,
    attemptingVerification: state.addCreditCard.attemptingVerification,
    purchasePackages: state.purchase.purchasePackages,
    selectedPurchasePackage:
      state.purchase.purchasePackages[
        state.purchase.selectedPurchasePackageIndex
      ],
    selectedPurchasePackageIndex: state.purchase.selectedPurchasePackageIndex,
    attemptingSend: state.purchase.attemptingSend,
    completedSend: state.purchase.completedSend,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetPurchase: () => {
      dispatch({ type: "RESET_CREDIT_CARD_PURCHASE" });
    },
    closePurchaseRoute: () => {
      dispatch({ type: "GO_BACK_ROUTE" });
    },
    startCreditCardPurchase: (purchaseData, inProgressData) => {
      dispatch({
        type: "PURCHASE_BEVEGRAM",
        payload: {
          purchaseData: purchaseData,
          routeData: inProgressData,
          route: "PurchaseInProgress",
        },
      });
    },
    sendBevegram: (sendBevegramData, inProgressData) => {
      dispatch({
        type: "SEND_BEVEGRAM",
        payload: {
          sendBevegramData: sendBevegramData,
          routeData: inProgressData,
          route: "SendInProgress",
        },
      });
    },
    purchaseAndSend: (purchaseData, sendBevegramData, inProgressData) => {
      dispatch({
        type: "PURCHASE_THEN_SEND_BEVEGRAM",
        payload: {
          purchaseData: purchaseData,
          sendBevegramData: sendBevegramData,
          routeData: inProgressData,
          route: "SendInProgress",
        },
      });
    },
    goToAddCreditCardRoute: () => {
      dispatch({ type: "GO_TO_ROUTE", payload: { route: "AddCreditCard" } });
    },
    removeCard: (cardId, cardIndex) => {
      dispatch({
        type: "REQUEST_REMOVE_CARD",
        payload: {
          cardToDelete: cardId,
          cardIndex: cardIndex,
        },
      });
    },
    updateDefaultCard: (newDefaultCardId: string) => {
      dispatch({
        type: "REQUEST_UPDATE_DEFAULT_CARD",
        payload: {
          newDefaultCard: newDefaultCardId,
        },
      });
    },
    selectPackage: (newSelectedPurchasePackageIndex: string) => {
      dispatch({
        type: "SELECT_PURCHASE_PACKAGE",
        payload: {
          newSelectedPurchasePackageIndex: newSelectedPurchasePackageIndex,
        },
      });
    },
    getUser: () => {
      dispatch({ type: "PURCHASE_REQUEST_UPDATE_USER" });
    },
  };
};

const CPurchaseBevegram = connect(mapStateToProps, mapDispatchToProps)(
  PurchaseBevegram,
);

export default CPurchaseBevegram;
