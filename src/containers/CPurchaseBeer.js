import { connect } from 'react-redux';

import {batchActions} from 'redux-batched-actions';

import { modalKeys } from '../reducers/modals';

import PurchaseBeer from '../components/PurchaseBeer';

const mapStateToProps = (state) => {
  return {
    fullName: state.modals.purchaseBeerModal.data.fullName,
    firstName: state.modals.purchaseBeerModal.data.firstName,
    purchase: state.purchase,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetPurchase: () => {
      dispatch({type: 'RESET_CREDIT_CARD_PURCHASE'});
    },
    closePurchaseModal: () => {
      dispatch(batchActions([
        {type: 'END_CREDIT_CARD_PURCHASE'},
        {type: 'CLOSE_MODAL', modalKey: modalKeys.purchaseBeerModal},
      ]));
    },
    startCreditCardPurchase: (cardData, purchaseData) => {
      dispatch({type: 'REQUEST_CREDIT_CARD_TOKEN', payload: {
        cardData: cardData,
        purchaseData: purchaseData,
      }});
    }
  }
}

const CPurchaseBeer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PurchaseBeer);

export default CPurchaseBeer;
