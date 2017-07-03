const defaultState = {};

export const redeemedBevegrams = (state = defaultState, action) => {
  switch (action.type) {
    case "ADD_REDEEMED_BEVEGRAMS": {
      const newState = { ...state };
      newState[action.payload.redeemedBevegramPack.id] =
        action.payload.redeemedBevegramPack.redeemedBevegram;
      return newState;
    }
    case "SET_REDEEMED_BEVEGRAM_LIST":
      return { ...action.payload.list };
    default:
      return state;
  }
};
