import {
  SentBevegram,
  SentBevegramSummary,
} from '../db/tables';

import {
  removeSentBevegramFromSentSummary,
} from '../api/firebase';

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
    case 'ADD_SENT_BEVEGRAM':
      // const sentBevegram = action.payload.sentBevegramPack.sentBevegram;
      // const id = action.payload.sentBevegramPack.id;
      const {sentBevegram, id} = action.payload.sentBevegramPack;
      const newSummary = removeSentBevegramFromSentSummary(state.summary, sentBevegram);
      let newEntry = {}
      newEntry[id] = sentBevegram;
      const newList = Object.assign({}, state.list, newEntry);
      return Object.assign({}, state, {
        summary: newSummary,
        list: newList,
      });
    case 'SET_SENT_BEVEGRAM_LIST': {
      return Object.assign({}, state, {
        list: action.payload.list,
      })
    }
    default:
      return state;
  }
}
