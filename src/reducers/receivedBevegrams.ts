const defaultState = {};

export const receivedBevegrams = (state = defaultState, action) => {
  switch (action.type) {
    case "UPDATE_RECEIVED_BEVEGRAMS":
      return { ...action.payload.receivedBevegrams };
    case "SET_RECEIVED_BEVEGRAM_LIST":
      return { ...action.payload.list };
    default:
      return state;
  }
};
