export type ContactsSortingMethod = "Upcoming Birthday" | "First Name" | "Last Name" | "Search"

interface ContactsSortObject {
  UpcomingBirthday: ContactsSortingMethod;
  FirstName: ContactsSortingMethod;
  LastName: ContactsSortingMethod;
  Search: ContactsSortingMethod;
}

export const ContactsSort: ContactsSortObject = {
  UpcomingBirthday:  "Upcoming Birthday",
  FirstName: "First Name",
  LastName: "Last Name",
  Search: "Search",
}

export interface ContactsSortOptionsViewLine {
  name: ContactsSortingMethod;
  icon: string;
}

export const ContactsSortOptionsViewList: ContactsSortOptionsViewLine[] = [
  {
    name: ContactsSort.UpcomingBirthday,
    icon: "birthday-cake"
  },
  {
    name: ContactsSort.FirstName,
    icon: "sort-alpha-asc"
  },
  {
    name: ContactsSort.LastName,
    icon: "sort-alpha-asc"
  },
]

interface ContactsViewState {
  sortingMethod: ContactsSortingMethod;
  searchQuery: string;
  searchInputIsFocused: boolean;
  isSortOptionsVisible: boolean;
}

const initialState: ContactsViewState = {
  sortingMethod: ContactsSort.FirstName,
  searchQuery: "",
  searchInputIsFocused: false,
  isSortOptionsVisible: false,
};

export const contactsView = (state = initialState, action) => {
  switch(action.type){
    case 'CHANGE_CONTACTS_SORT_METHOD':
      return Object.assign({}, state, {
        sortingMethod: action.payload.newSortingMethod,
      })
    case 'UPDATE_CONTACTS_VIEW_SEARCH_QUERY':
      return Object.assign({}, state, {
        searchQuery: action.payload.newQuery,
        sortingMethod: ContactsSort.Search,
      })
    case "ENTERED_SEARCH_INPUT":
      return Object.assign({}, state, {
        searchInputIsFocused: true,
      })
    case "EXITED_SEARCH_INPUT":
      return Object.assign({}, state, {
        searchInputIsFocused: false,
      })
    case 'SHOW_SORT_OPTIONS':
      return Object.assign({}, state, {
        isSortOptionsVisible: true,
      })
    case 'HIDE_SORT_OPTIONS':
      return Object.assign({}, state, {
        isSortOptionsVisible: false,
      })
    default:
      return state;
  }
}
