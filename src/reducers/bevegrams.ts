import uuid from 'react-native-uuid'

export interface Bevegram {
  from: string;
  message: string;
  date: string;
  imagePath: string;
  id: string;
}

const addBevegram = (from: string, message: string, date: string, imagePath: string): Bevegram => {
  return {
    from: from,
    message: message,
    date: date,
    imagePath: imagePath,
    id: uuid.v1(),
  }
}

const redeemBevegram = (bevegrams, id) => {
  // Remove the bevegram with id from the new state
  return bevegrams.filter(function(bevegram){
    return bevegram.id !== id;
  });
}

const initialState = [
  addBevegram("Travis Caldwell", "Hello", "September 5 2016", "test.jpg"),
  addBevegram("Andrew Simms", "Hello", "September 8 2016", "test.jpg"),
  addBevegram("Brian Ripley", "Hello", "September 12 2016", "test.jpg"),
]

export const bevegrams = (state = initialState, action) => {
  switch(action.type){
    case 'REDEEM_BEVEGRAM': {
      return redeemBevegram(state, action.bevegramId);
    }
    default:
      return state;
  }
}
