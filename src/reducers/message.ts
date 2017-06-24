interface MessageState {
  message: string;
}

const defaultState = {
  message: undefined,
};

export const message = (state = defaultState, action) => {
  switch (action.type) {
    case "UPDATE_MESSAGE":
      return {
        ...state,
        message: action.payload,
      };
    case "RESET_MESSAGE":
      return defaultState;
    default:
      return state;
  }
};
