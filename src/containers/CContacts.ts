import {connect} from 'react-redux';

import moment from 'moment';
import Fuse from 'fuse.js';

import {Contact} from '../reducers/contacts';

import {ContactsSort, ContactsSortingMethod, ContactsSortOptionsViewLine, ContactsSortOptionsViewList} from '../reducers/contactsView';


import Contacts, {ContactsProps} from '../components/Contacts';

interface StateProps {
  contacts?: any;
  loading?: boolean;
  loadingFailed?: boolean;
  purchaseModalIsOpen?: boolean;
  reloading?: boolean;
  reloadingFailed?: boolean;
  facebookToken?: string;
  toastContactsReloaded?: boolean;
  activeSortingMethod?: ContactsSortingMethod,
  searchQuery?: string,
  sortingMethodsList?: ContactsSortOptionsViewLine[];
  searchInputIsFocused?: boolean;
  isSortOptionsVisible?: boolean;
}

const sortContacts = (sortingMethod: ContactsSortingMethod, contactsList: Contact[], searchQuery: string) => {
  if(contactsList.length < 2) {
    return contactsList;
  }

  if(sortingMethod === ContactsSort.Search && searchQuery !== "") {
    const fuseOptions = {
      shoultSort: true,
      threshold: 0.6,
      keys: [
        "name.first",
        "name.last",
      ]
    }
    const fuse = new Fuse(contactsList, fuseOptions);
    return fuse.search(searchQuery);
  }

  return contactsList.sort((a, b) => {
    switch(sortingMethod) {
      case ContactsSort.FirstName:
        return stringCompare(a.name.first, b.name.first);
      case ContactsSort.LastName:
        return stringCompare(a.name.last, b.name.last);
      case ContactsSort.UpcomingBirthday:
        return birthdayDayOfYearCompare(a.birthDayOfYear, b.birthDayOfYear);
      default:
        return birthdayDayOfYearCompare(a.birthDayOfYear, b.birthDayOfYear);
    }
  })
}

const stringCompare = (a: string, b: string) => {
    return a.localeCompare(b);
}

const birthdayDayOfYearCompare = (aDayOfYear: number, bDayOfYear: number) => {

  const a = normalizeDay(aDayOfYear);
  const b = normalizeDay(bDayOfYear);

  if(a > b) return 1;
  if(a < b) return -1;
  if(a === b) return 0;
}

const normalizeDay = (day: number) => {
  const dayOfYear = moment().dayOfYear();
  if(day < dayOfYear) {
    return day + 365;
  }
  return day;
}

const mapStateToProps = (state): StateProps => {
  return {
    contacts: sortContacts(state.contactsView.sortingMethod, state.contacts.contactList, state.contactsView.searchQuery),
    loading: state.contacts.loadingFromFacebook,
    loadingFailed: state.contacts.loadingFromFacebookFailed,
    purchaseModalIsOpen: state.modals.purchaseBeerModal.isOpen,
    reloading: state.contacts.reloadingFromFacebook,
    reloadingFailed: state.contacts.reloadingFromFacebookFailed,
    facebookToken: state.user.facebook.token,
    toastContactsReloaded: state.contacts.toastContactsReloaded,
    activeSortingMethod: state.contactsView.sortingMethod,
    searchQuery: state.contactsView.searchQuery,
    sortingMethodsList: ContactsSortOptionsViewList,
    searchInputIsFocused: state.contactsView.searchInputIsFocused,
    isSortOptionsVisible: state.contactsView.isSortOptionsVisible,
  }
}

interface DispatchProps {
  reloadContacts?(string);
  changeSortMethod?(ContactsSortingMethod)
  enteredSearchInput?();
  exitedSearchInput?();
  showSortOptions?();
  hideSortOptions?();
}

const mapDispatchToProps = (dispatch) => {
  return {
    reloadContacts: (fbToken) => {
      dispatch({type: 'FACEBOOK_CONTACTS_RELOAD_REQUEST', payload: {token: fbToken}});
    },
    changeSortMethod: (newSortingMethod: ContactsSortingMethod) => {
      dispatch({type: 'CHANGE_CONTACTS_SORT_METHOD', payload: {
        newSortingMethod: newSortingMethod,
      }})
    },
    updateSearchQuery: (newQuery: string) => {
      dispatch({type: 'UPDATE_CONTACTS_VIEW_SEARCH_QUERY', payload: {
        newQuery: newQuery,
      }})
    },
    enteredSearchInput: () => {
      dispatch({type: 'ENTERED_SEARCH_INPUT'});
    },
    exitedSearchInput: () => {
      dispatch({type: 'EXITED_SEARCH_INPUT'});
    },
    showSortOptions: () => {
      dispatch({type: 'SHOW_SORT_OPTIONS'});
    },
    hideSortOptions: () => {
      dispatch({type: 'HIDE_SORT_OPTIONS'});
    },
  }
}

const CContacts = connect<StateProps, DispatchProps, ContactsProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Contacts);

export default CContacts;
