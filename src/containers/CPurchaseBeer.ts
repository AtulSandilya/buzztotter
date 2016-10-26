import { connect } from 'react-redux';

import {batchActions} from 'redux-batched-actions';

import { modalKeys } from '../reducers/modals';

import PurchaseBeer from '../components/PurchaseBeer';

const mapStateToProps = (state) => {
  return {
    fullName: state.routes.PurchaseBeer.data.fullName,
    firstName: state.routes.PurchaseBeer.data.firstName,
    purchase: state.purchase,
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
