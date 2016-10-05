import {connect} from 'react-redux';

import {batchActions} from 'redux-batched-actions';

import { modalKeys } from '../reducers/modals';

import {Contact} from '../reducers/contacts';

import Contacts, {ContactsProps} from '../components/Contacts';

interface StateProps {
  contacts?: [Contact];
  loading?: boolean;
  loadingFailed?: boolean;
  purchaseModalIsOpen?: boolean;
}

const mapStateToProps = (state): StateProps => {
  return {
    contacts: state.contacts.contactList,
    loading: state.contacts.loadingFromFacebook,
    loadingFailed: state.contacts.loadingFromFacebookFailed,
    purchaseModalIsOpen: state.modals.purchaseBeerModal.isOpen,
  }
}

interface DispatchProps {
  closePurchaseModal?(): void;
}

const mapDispatchToProps = (dispatch) => {
  return {
    closePurchaseModal: () => {
      dispatch(batchActions([
        {type: 'END_CREDIT_CARD_PURCHASE'},
        {type: 'CLOSE_MODAL', modalKey: modalKeys.purchaseBeerModal},
      ]));
    }
  }
}

const CContacts = connect<StateProps, DispatchProps, ContactsProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Contacts);

export default CContacts;
