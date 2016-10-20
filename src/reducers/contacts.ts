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
  reloadingFromFacebook: false,
  reloadingFromFacebookFailed: false,
  toastContactsReloaded: false,
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

    let birthday = "unknown";
    if(contact.birthday){
      birthday = contact.birthday;
    }

    return formatContact(contact.first_name, contact.last_name, birthday, contact.picture.data.url);
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
      return Object.assign({}, state, {
          loadingFromFacebook: true,
      });
    case 'FAILED_LOADING_CONTACTS_FROM_FACEBOOK':
      return Object.assign({}, state, {
          loadingFromFacebookFailed: true,
      });
    case 'RELOADING_CONTACTS_FROM_FACEBOOK':
      return Object.assign({}, state, {
          reloadingFromFacebook: true,
      });
    case 'COMPLETED_RELOADING_CONTACTS_FROM_FACEBOOK':
      return Object.assign({}, state, {
          reloadingFromFacebook: false,
      });
    case 'FAILED_RELOADING_CONTACTS_FROM_FACEBOOK':
      return Object.assign({}, state, {
          reloadingFromFacebookFailed: true,
      });
    case 'TOAST_CONTACTS_RELOADED':
      return Object.assign({}, state, {
          toastContactsReloaded: true,
      });
    case 'END_TOAST_CONTACTS_RELOADED':
      return Object.assign({}, state, {
          toastContactsReloaded: false,
      });
    default:
      return state;
  }
}
