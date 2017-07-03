import { connect } from "react-redux";

import Fuse from "fuse.js";
import moment from "moment";

import { Contact } from "../reducers/contacts";

import {
  ContactsSort,
  ContactsSortingMethod,
  ContactsSortOptionsViewLine,
  ContactsSortOptionsViewList,
} from "../reducers/contactsView";

import Contacts, { ContactsProps } from "../components/Contacts";

interface StateProps {
  contacts?: any;
  loading?: boolean;
  loadingFailed?: boolean;
  purchaseModalIsOpen?: boolean;
  reloading?: boolean;
  reloadingFailed?: boolean;
  facebookToken?: string;
  toastContactsReloaded?: boolean;
  activeSortingMethod?: ContactsSortingMethod;
  searchQuery?: string;
  sortingMethodsList?: ContactsSortOptionsViewLine[];
  searchInputIsFocused?: boolean;
  isSortOptionsVisible?: boolean;
  inviteInProgress?: boolean;
}

const sortContacts = (
  sortingMethod: ContactsSortingMethod,
  contactsList: Contact[],
  searchQuery: string,
) => {
  if (contactsList.length <= 1) {
    return contactsList;
  }

  if (sortingMethod === ContactsSort.Search && searchQuery !== "") {
    const fuseOptions = {
      keys: ["name.first", "name.last"],
      shoultSort: true,
      threshold: 0.6,
    };
    const fuse = new Fuse(contactsList, fuseOptions);
    return fuse.search(searchQuery);
  }

  return contactsList.sort((a, b) => {
    switch (sortingMethod) {
      case ContactsSort.FirstName:
        return stringCompare(a.name.first, b.name.first);
      case ContactsSort.LastName:
        return stringCompare(a.name.last, b.name.last);
      case ContactsSort.UpcomingBirthday:
        return birthdayDayOfYearCompare(a.birthDayOfYear, b.birthDayOfYear);
      default:
        return birthdayDayOfYearCompare(a.birthDayOfYear, b.birthDayOfYear);
    }
  });
};

const stringCompare = (a: string, b: string) => {
  return a.localeCompare(b);
};

const birthdayDayOfYearCompare = (aDayOfYear: number, bDayOfYear: number) => {
  const a = normalizeDay(aDayOfYear);
  const b = normalizeDay(bDayOfYear);

  if (a > b) return 1;
  if (a < b) return -1;
  if (a === b) return 0;
};

const normalizeDay = (day: number) => {
  const dayOfYear = moment().dayOfYear();
  if (day < dayOfYear) {
    return day + 365;
  }
  return day;
};

const mapStateToProps = (state): StateProps => {
  return {
    activeSortingMethod: state.contactsView.sortingMethod,
    contacts: sortContacts(
      state.contactsView.sortingMethod,
      state.contacts.contactList,
      state.contactsView.searchQuery,
    ),
    inviteInProgress: state.contactsView.inviteInProgress,
    isSortOptionsVisible: state.contactsView.isSortOptionsVisible,
    loading: state.contacts.loadingFromFacebook,
    loadingFailed: state.contacts.loadingFromFacebookFailed,
    purchaseModalIsOpen: state.modals.purchaseBeerModal.isOpen,
    reloading: state.contacts.reloadingFromFacebook,
    reloadingFailed: state.contacts.reloadingFromFacebookFailed,
    searchInputIsFocused: state.contactsView.searchInputIsFocused,
    searchQuery: state.contactsView.searchQuery,
    sortingMethodsList: ContactsSortOptionsViewList,
    toastContactsReloaded: state.contacts.toastContactsReloaded,
  };
};

interface DispatchProps {
  reloadContacts?: () => void;
  changeSortMethod?: (sortMethod: ContactsSortingMethod) => void;
  enteredSearchInput?: () => void;
  exitedSearchInput?: () => void;
  showSortOptions?: () => void;
  hideSortOptions?: () => void;
  showAppInvite?: () => void;
}

const mapDispatchToProps = dispatch => {
  return {
    changeSortMethod: (newSortingMethod: ContactsSortingMethod) => {
      dispatch({
        type: "CHANGE_CONTACTS_SORT_METHOD",
        payload: {
          newSortingMethod: newSortingMethod,
        },
      });
    },
    enteredSearchInput: () => {
      dispatch({ type: "ENTERED_SEARCH_INPUT" });
    },
    exitedSearchInput: () => {
      dispatch({ type: "EXITED_SEARCH_INPUT" });
    },
    hideSortOptions: () => {
      dispatch({ type: "HIDE_SORT_OPTIONS" });
    },
    reloadContacts: () => {
      dispatch({ type: "FACEBOOK_CONTACTS_RELOAD_REQUEST" });
    },
    showAppInvite: () => {
      dispatch({ type: "REQUEST_APP_INVITE" });
    },
    showSortOptions: () => {
      dispatch({ type: "SHOW_SORT_OPTIONS" });
    },
    updateSearchQuery: (newQuery: string) => {
      dispatch({
        type: "UPDATE_CONTACTS_VIEW_SEARCH_QUERY",
        payload: {
          newQuery: newQuery,
        },
      });
    },
  };
};

const CContacts = connect<StateProps, DispatchProps, ContactsProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Contacts);

export default CContacts;
