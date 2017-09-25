import moment from "moment";

export interface Name {
  first: string;
  last: string;
}

export interface Contact {
  name: Name;
  birthday: string;
  birthDayOfYear: number;
  imagePath: string;
  facebookId: string;
}

interface Birthday {
  dateStr: string;
  dayOfYear: number;
}

const parseBirthday = (inputDate: string): Birthday => {
  const dateButNotYearRegex = /\d\d\/\d\d/; // 11/29
  const completeDateRegex = /\d\d\/\d\d\/\d\d\d\d/; // 11/29/1970

  try {
    let bday;

    if (inputDate.match(dateButNotYearRegex)) {
      bday = moment(inputDate, "MM/DD");
    } else if (inputDate.match(completeDateRegex)) {
      bday = moment(inputDate, "MM/DD/YYYY");
    } else {
      throw Error;
    }

    const dateStr = bday.format("MMMM D"); // November 29
    const dayOfYear = bday.dayOfYear();

    if (dateStr === "Invalid date" || Number.isNaN(dayOfYear)) {
      throw Error;
    }

    return {
      dateStr,
      dayOfYear,
    };
  } catch (e) {
    return {
      dateStr: "Unlisted",
      dayOfYear: 9999,
    };
  }
};

const formatContact = (firstName, lastName, bdayStr, imagePath, facebookId) => {
  const bday: Birthday = parseBirthday(bdayStr);

  return {
    birthDayOfYear: bday.dayOfYear,
    birthday: bday.dateStr,
    facebookId,
    imagePath,
    name: {
      first: firstName,
      last: lastName,
    },
  };
};

const initialState = {
  contactList: [],
  loadingFromFacebook: false,
  loadingFromFacebookFailed: false,
  reloadingFromFacebook: false,
  reloadingFromFacebookFailed: false,
  toastContactsReloaded: false,
};

const sortContactsByBirthday = contacts => {
  const dayOfYear = moment().dayOfYear();

  const newContacts = contacts.map(contact => {
    const daysInYear = 365;
    if (contact.birthDayOfYear < dayOfYear) {
      contact.birthDayOfYear += daysInYear;
    }
    return contact;
  });

  newContacts.sort((a, b) => {
    if (a.birthDayOfYear > b.birthDayOfYear) {
      return 1;
    }
    if (a.birthDayOfYear < b.birthDayOfYear) {
      return -1;
    }
    if (a.birthDayOfYear === b.birthDayOfYear) {
      return 0;
    }
  });

  return newContacts;
};

const addContactsFromFacebook = (state, contacts) => {
  const newContacts = contacts.data.map((contact) => {
    let birthday = "unknown";
    if (contact.birthday) {
      birthday = contact.birthday;
    }

    return formatContact(
      contact.first_name,
      contact.last_name,
      birthday,
      contact.picture.data.url,
      contact.id,
    );
  });
  return {
    ...state,

    contactList: newContacts,
    loadingFromFacebook: false,
  };
};

export const contacts = (state = initialState, action) => {
  switch (action.type) {
    case "POPULATE_CONTACTS_FROM_FACEBOOK":
      return addContactsFromFacebook(state, action.payload.contacts);
    case "LOADING_CONTACTS_FROM_FACEBOOK":
      return {
        ...state,
        loadingFromFacebook: true,
      };
    case "FAILED_LOADING_CONTACTS_FROM_FACEBOOK":
      return {
        ...state,
        loadingFromFacebookFailed: true,
      };
    case "RELOADING_CONTACTS_FROM_FACEBOOK":
      return {
        ...state,
        reloadingFromFacebook: true,
      };
    case "COMPLETED_RELOADING_CONTACTS_FROM_FACEBOOK":
      return {
        ...state,
        reloadingFromFacebook: false,
      };
    case "FAILED_RELOADING_CONTACTS_FROM_FACEBOOK":
      return {
        ...state,
        reloadingFromFacebookFailed: true,
      };
    case "TOAST_CONTACTS_RELOADED":
      return {
        ...state,
        toastContactsReloaded: true,
      };
    case "END_TOAST_CONTACTS_RELOADED":
      return {
        ...state,
        toastContactsReloaded: false,
      };
    default:
      return state;
  }
};
