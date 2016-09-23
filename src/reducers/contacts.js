import moment from 'moment';

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

const initialState = [];

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
  console.log("addContactsFromFacebook", contacts);
  const newContacts = contacts.data.map(function(contact){
    return formatContact(contact.first_name, contact.last_name, "unknown", contact.picture.data.url);
  })
  console.log("newContacts", newContacts);
  return newContacts;
}

export const contacts = (state = initialState, action) => {
  switch(action.type){
    case 'POPULATE_CONTACTS_FROM_FACEBOOK':
      return addContactsFromFacebook(state, action.payload.contacts);
    default:
      return state;
  }
}
