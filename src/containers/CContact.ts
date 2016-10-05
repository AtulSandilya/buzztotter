import { connect } from 'react-redux';

import { modalKeys } from '../reducers/modals';

import Contact, {ContactProps} from '../components/Contact';

interface DispatchProps {
  openPurchaseModal?(modalData: any): void;
  closePurchaseModal?(): void;
}

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
      dispatch({type: 'CLOSE_MODAL', modalKey: modalKeys.purchaseBeerModal});
    }
  }
}

const CContact = connect<{}, DispatchProps, ContactProps>(
  undefined,
  mapDispatchToProps
)(Contact);

export default CContact;
