const defaultState = {}

export const receivedBevegrams = (state = defaultState, action) => {
  switch(action.type){
    case 'UPDATE_RECEIVED_BEVEGRAMS':
      return Object.assign({}, action.payload.receivedBevegrams);
    default:
      return state;
  }
}
