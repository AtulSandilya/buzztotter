import { SentBevegram, SentBevegramSummary } from "../db/tables";

interface DefaultState {
  list: object;
  summary: SentBevegramSummary;
}

const defaultState: DefaultState = {
  list: {},
  summary: {
    availableToSend: 0,
    sent: 0,
  },
};

export const sentBevegrams = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_SENT_BEVEGRAM_LIST": {
      return {
        ...state,
        list: action.payload.list,
      };
    }
    default:
      return state;
  }
};
