import moment from 'moment';

export interface Name {
  first: string;
  last: string;
}

export interface Contact {
  name: Name;
  birthday: string,
  birthDayOfYear: number,
  imagePath: string,
}

const formatContact = (firstName, lastName, bdayStr, imagePath) => {
  var bday = moment(bdayStr, "MMM DD YYYY");
  var bdayFormattedStr = bday.format("MMMM Do");
  var bdayNumber = bday.dayOfYear();

  // Check for bad conversions
  if(bdayFormattedStr === "Invalid date" || Number.isNaN(bdayNumber)){
    bdayNumber = 9999;
    bdayFormattedStr = "Unlisted";
  }

  return {
    name: {
      first: firstName,
      last: lastName,
    },
    birthday: bdayFormattedStr,
    birthDayOfYear: bdayNumber,
    imagePath: imagePath,
  }
}

const initialState = {
  loadingFromFacebook: false,
  loadingFromFacebookFailed: false,
  contactList: [],
}

const sortContactsByBirthday = (contacts) => {

  var dayOfYear = moment().dayOfYear();

  var newContacts = contacts.map(function(contact){
    if(contact.birthDayOfYear < dayOfYear){
      contact.birthDayOfYear += 365;
    }
    return contact;
  });

  newContacts.sort(function(a, b){
    if(a.birthDayOfYear > b.birthDayOfYear) return 1;
    if(a.birthDayOfYear < b.birthDayOfYear) return -1;
    if(a.birthDayOfYear === b.birthDayOfYear) return 0;
  });

  return newContacts;
}


const addContactsFromFacebook = (state, contacts) => {
  const newContacts = contacts.data.map(function(contact){
    return formatContact(contact.first_name, contact.last_name, "unknown", contact.picture.data.url);
  })
  return Object.assign({}, state,
    {
      contactList: newContacts,
      loadingFromFacebook: false
    }
  );
}

export const contacts = (state = initialState, action) => {
  switch(action.type){
    case 'POPULATE_CONTACTS_FROM_FACEBOOK':
      return addContactsFromFacebook(state, action.payload.contacts);
    case 'LOADING_CONTACTS_FROM_FACEBOOK':
      return Object.assign({}, state,
        {
          loadingFromFacebook: true,
        }
      );
    default:
      return state;
  }
}
