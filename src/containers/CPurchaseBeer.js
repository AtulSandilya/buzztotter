import { connect } from 'react-redux';

import { modalKeys } from '../reducers/modals';

import PurchaseBeer from '../components/PurchaseBeer';

const mapStateToProps = (state) => {
  return {
    fullName: state.modals.purchaseBeerModal.data.fullName,
    firstName: state.modals.purchaseBeerModal.data.firstName,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closePurchaseModal: () => {
      dispatch({type: 'CLOSE_MODAL', modalKey: modalKeys.purchaseBeerModal});
    },
    purchaseBeer: () => {
      dispatch({type: 'REQUEST_CREDIT_CARD_TOKEN'});
    }
  }
}

const CPurchaseBeer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PurchaseBeer);

export default CPurchaseBeer;
