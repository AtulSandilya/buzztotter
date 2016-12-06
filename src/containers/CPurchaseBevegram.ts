import { connect } from 'react-redux';

import {batchActions} from 'redux-batched-actions';

import { modalKeys } from '../reducers/modals';

import PurchaseBevegram from '../components/PurchaseBevegram';

const mapStateToProps = (state) => {
  return {
    userBevegrams: state.user.bevegrams,
    fullName: state.routes.PurchaseBevegram.data.fullName,
    firstName: state.routes.PurchaseBevegram.data.firstName,
    purchase: state.purchase,
    creditCards: state.user.stripe.creditCards,
    activeCardId: state.user.stripe.activeCardId,
    attemptingUpdate: state.purchase.attemptingStripeUpdate,
    attemptingVerification: state.addCreditCard.attemptingVerification,
    purchasePackages: state.purchase.purchasePackages,
    selectedPurchasePackage: state.purchase.purchasePackages[state.purchase.selectedPurchasePackageIndex],
    selectedPurchasePackageIndex: state.purchase.selectedPurchasePackageIndex,
    attemptingSend: state.purchase.attemptingSend,
    completedSend: state.purchase.completedSend,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetPurchase: () => {
      dispatch({type: 'RESET_CREDIT_CARD_PURCHASE'});
    },
    closePurchaseRoute: () => {
      dispatch({type: 'GO_BACK_ROUTE'});
    },
    startCreditCardPurchase: (purchaseData, inProgressData) => {
      dispatch({type: 'REQUEST_CREDIT_CARD_PURCHASE', payload: {
        purchaseData: purchaseData,
        routeData: inProgressData,
        route: "PurchaseAndOrSendInProgress",
      }});
    },
    sendBevegram: (sendBevegramData, inProgressData) => {
      dispatch({type: 'SEND_BEVEGRAM', payload: {
        sendBevegramData: sendBevegramData,
        routeData: inProgressData,
        route: "PurchaseAndOrSendInProgress",
      }})
    },
    purchaseAndSend: (purchaseData, sendBevegramData, inProgressData) => {
      dispatch({type: 'PURCHASE_THEN_SEND_BEVEGRAM', payload: {
        purchaseData: purchaseData,
        sendBevegramData: sendBevegramData,
        routeData: inProgressData,
        route: "PurchaseAndOrSendInProgress",
      }})
    },
    goToAddCreditCardRoute: () => {
      dispatch({type: 'GO_TO_ROUTE', payload: {route: "AddCreditCard"}});
    },
    removeCard: (cardId, cardIndex) => {
      dispatch({type: 'REQUEST_REMOVE_CARD', payload: {
        cardToDelete: cardId,
        cardIndex: cardIndex,
      }})
    },
    updateDefaultCard: (newDefaultCardId: string) => {
      dispatch({type: 'REQUEST_UPDATE_DEFAULT_CARD', payload: {
        newDefaultCard: newDefaultCardId,
      }})
    },
    selectPackage: (newSelectedPurchasePackageIndex: string) => {
      dispatch({type: 'SELECT_PURCHASE_PACKAGE', payload: {
        newSelectedPurchasePackageIndex: newSelectedPurchasePackageIndex,
      }})
    }
  }
}

const CPurchaseBevegram = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PurchaseBevegram);

export default CPurchaseBevegram;