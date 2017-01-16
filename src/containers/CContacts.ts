import {connect} from 'react-redux';

import {Contact} from '../reducers/contacts';

import Contacts, {ContactsProps} from '../components/Contacts';

interface StateProps {
  contacts?: [Contact];
  loading?: boolean;
  loadingFailed?: boolean;
  purchaseModalIsOpen?: boolean;
  reloading?: boolean;
  reloadingFailed?: boolean;
  facebookToken?: string;
  toastContactsReloaded?: boolean;
}

const mapStateToProps = (state): StateProps => {
  return {
    contacts: state.contacts.contactList,
    loading: state.contacts.loadingFromFacebook,
    loadingFailed: state.contacts.loadingFromFacebookFailed,
    purchaseModalIsOpen: state.modals.purchaseBeerModal.isOpen,
    reloading: state.contacts.reloadingFromFacebook,
    reloadingFailed: state.contacts.reloadingFromFacebookFailed,
    facebookToken: state.user.facebook.token,
    toastContactsReloaded: state.contacts.toastContactsReloaded,
  }
}

interface DispatchProps {
  reloadContacts?(string);
}

const mapDispatchToProps = (dispatch) => {
  return {
    reloadContacts: (fbToken) => {
      dispatch({type: 'FACEBOOK_CONTACTS_RELOAD_REQUEST', payload: {token: fbToken}});
    }
  }
}

const CContacts = connect<StateProps, DispatchProps, ContactsProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Contacts);

export default CContacts;
