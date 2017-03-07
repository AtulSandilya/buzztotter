const defaultState = {}

export const receivedBevegrams = (state = defaultState, action) => {
  switch(action.type){
    case 'UPDATE_RECEIVED_BEVEGRAMS':
      return Object.assign({}, action.payload.receivedBevegrams);
    case 'SET_RECEIVED_BEVEGRAM_LIST':
      return Object.assign({}, action.payload.list);
    default:
      return state;
  }
}
