import {connect} from 'react-redux';

import { modalKeys } from '../reducers/modals';

import Contacts from '../components/Contacts';

const mapStateToProps = (state) => {
  return {
    contacts: state.contacts.contactList,
    loading: state.contacts.loadingFromFacebook,
    loadingFailed: state.contacts.loadingFromFacebookFailed,
    purchaseModalIsOpen: state.modals.purchaseBeerModal.isOpen,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closePurchaseModal: () => {
      dispatch({type: 'CLOSE_MODAL', modalKey: modalKeys.purchaseBeerModal});
    }
  }
}

const CContacts = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Contacts);

export default CContacts;
