const defaultState = {
  response: null,
}

export const purchase = (state = defaultState, action) => {
  switch(action.type){
    case 'HANDLE_CREDIT_CARD_RESPONSE':
      console.log("Credit card response: ", action.payload);
      return state;
    default:
      return state;
  }
}
