import { connect } from 'react-redux';

import {batchActions} from 'redux-batched-actions';

import { modalKeys } from '../reducers/modals';

import PurchaseBeer from '../components/PurchaseBeer';

const mapStateToProps = (state) => {
  return {
    fullName: state.routes.PurchaseBeer.data.fullName,
    firstName: state.routes.PurchaseBeer.data.firstName,
    purchase: state.purchase,
    creditCards: state.user.stripe.creditCards,
    activeCard: state.user.stripe.activeCardId,
    attemptingUpdate: state.purchase.attemptingStripeUpdate,
    attemptingVerification: state.addCreditCard.attemptingVerification,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetPurchase: () => {
      dispatch({type: 'RESET_CREDIT_CARD_PURCHASE'});
    },
    closePurchaseRoute: () => {
      dispatch({
        type: 'GO_BACK_ROUTE',
        payload: {
          route: "PurchaseBeer",
          nextRoute: "MainUi",
          preActions: [{type: 'END_CREDIT_CARD_PURCHASE'}],
        }
      });
    },
    startCreditCardPurchase: (purchaseData) => {
      dispatch({type: 'REQUEST_CREDIT_CARD_PURCHASE', payload: {
        purchaseData: purchaseData,
      }});
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
  }
}

const CPurchaseBeer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PurchaseBeer);

export default CPurchaseBeer;
