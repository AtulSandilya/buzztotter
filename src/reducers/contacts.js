import moment from 'moment';

const addContact = (firstName, lastName, bdayStr, imagePath) => {
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

const initialState = [
  addContact('Travis', 'Caldwell', 'October 1 1987', 'test.jpg'),
  addContact('Brian', 'Ripley', 'September 15 1987', 'test.jpg'),
  addContact('Andrew', 'Simms', 'January 2 1987', 'test.jpg'),
  addContact('Scott', 'Jones', 'May 2 1987', 'test.jpg'),
  addContact('Sarah', 'Johnson', 'April 3 1987', 'test.jpg'),
  addContact('Mike', 'Thomas', 'March 2 1987', 'test.jpg'),
  addContact('Jen', 'Smith', 'April 22 1987', 'test.jpg'),
  addContact('Jerry', 'Martinez', 'February 12 1987', 'test.jpg'),
  addContact('Jack', 'Sorenson', 'June 12 1987', 'test.jpg'),
  addContact('Fred', 'Jackson', 'July 29 1987', 'test.jpg'),
  addContact('John', 'Erickson', 'August 9 1987', 'test.jpg'),
  addContact('Tom', 'Blackstone', 'December 14 1987', 'test.jpg'),
  addContact('Brooke', 'Zapato', 'Juneteenth 38 1987', 'test.jpg'),
]

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

export const contacts = (state = initialState, action) => {
  switch(action.type){
    default:
      return sortContactsByBirthday(state);
  }
}
