/* tslint:disable:object-literal-sort-keys */

export type ContactsSortingMethod =
  | "Upcoming Birthday"
  | "First Name"
  | "Last Name"
  | "Search";

interface ContactsSortObject {
  UpcomingBirthday: ContactsSortingMethod;
  FirstName: ContactsSortingMethod;
  LastName: ContactsSortingMethod;
  Search: ContactsSortingMethod;
}

export const ContactsSort: ContactsSortObject = {
  UpcomingBirthday: "Upcoming Birthday",
  FirstName: "First Name",
  LastName: "Last Name",
  Search: "Search",
};

export interface ContactsSortOptionsViewLine {
  name: ContactsSortingMethod;
  icon: string;
}

export const ContactsSortOptionsViewList: ContactsSortOptionsViewLine[] = [
  {
    name: ContactsSort.UpcomingBirthday,
    icon: "birthday",
  },
  {
    name: ContactsSort.FirstName,
    icon: "sortAlphabetical",
  },
  {
    name: ContactsSort.LastName,
    icon: "sortAlphabetical",
  },
];

interface ContactsViewState {
  sortingMethod: ContactsSortingMethod;
  searchQuery: string;
  searchInputIsFocused: boolean;
  isSortOptionsVisible: boolean;
  inviteInProgress: boolean;
}

const initialState: ContactsViewState = {
  sortingMethod: ContactsSort.FirstName,
  searchQuery: "",
  searchInputIsFocused: false,
  isSortOptionsVisible: false,
  inviteInProgress: false,
};

export const contactsView = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_CONTACTS_SORT_METHOD":
      return {
        ...state,
        sortingMethod: action.payload.newSortingMethod,
      };
    case "UPDATE_CONTACTS_VIEW_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload.newQuery,
        sortingMethod: ContactsSort.Search,
      };
    case "ENTERED_SEARCH_INPUT":
      return {
        ...state,
        searchInputIsFocused: true,
      };
    case "EXITED_SEARCH_INPUT":
      return {
        ...state,
        searchInputIsFocused: false,
      };
    case "SHOW_SORT_OPTIONS":
      return {
        ...state,
        isSortOptionsVisible: true,
      };
    case "HIDE_SORT_OPTIONS":
      return {
        ...state,
        isSortOptionsVisible: false,
      };
    case "INVITE_IN_PROGRESS":
      return {
        ...state,
        inviteInProgress: true,
      };
    case "INVITE_COMPLETE":
      return {
        ...state,
        inviteInProgress: false,
      };
    default:
      return state;
  }
};
