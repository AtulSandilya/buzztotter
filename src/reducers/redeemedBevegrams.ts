const defaultState = {};

export const redeemedBevegrams = (state = defaultState, action) => {
  switch(action.type) {
    case 'ADD_REDEEMED_BEVEGRAMS': {
      const newState = Object.assign({}, state);
      newState[action.payload.redeemedBevegramPack.id] = action.payload.redeemedBevegramPack.redeemedBevegram;
      return newState;
    }
    default:
      return defaultState;
  }
}
