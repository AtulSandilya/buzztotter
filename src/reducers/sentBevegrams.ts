import {
  SentBevegram,
  SentBevegramSummary,
} from '../db/tables';

interface DefaultState {
  list: Object;
  summary: SentBevegramSummary;
}

const defaultState: DefaultState = {
  summary: {
    availableToSend: 0,
    sent: 0,
  },
  list: {},
}

export const sentBevegrams = (state = defaultState, action) => {
  switch(action.type){
    case 'SET_SENT_BEVEGRAM_LIST': {
      return Object.assign({}, state, {
        list: action.payload.list,
      })
    }
    default:
      return state;
  }
}
