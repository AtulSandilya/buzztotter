import { connect } from 'react-redux';

import { modalKeys } from '../reducers/modals';

import Contact from '../components/Contact';

const mapDispatchToProps = (dispatch) => {
  return {
    openPurchaseModal: (modalData) => {
      dispatch({
        type: 'OPEN_MODAL',
        modalKey: modalKeys.purchaseBeerModal,
        dataForModal: modalData,
      })
    },
    closePurchaseModal: () => {
      console.log("CContact closePurchase Modal");
      dispatch({type: 'CLOSE_MODAL', modalKey: modalKeys.purchaseBeerModal});
    }
  }
}

const CContact = connect(
  undefined,
  mapDispatchToProps
)(Contact);

export default CContact;
