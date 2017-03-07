import {
  PurchasedBevegram,
  PurchasedBevegramSummary,
} from '../db/tables';

import {
  addPurchasedBevegramToPurchaseSummary,
  removeSentBevegramFromPurchaseSummary,
} from '../api/firebase';

interface PurchasedBevegramState {
  summary: PurchasedBevegramSummary,
  list: Object,
}

const defaultState = {
  summary: {
    quantityPurchased: 0,
    availableToSend: 0,
    sent: 0,
  },
  list: {},
}

export const purchasedBevegrams = (state = defaultState, action) => {
  switch(action.type){
    case 'ADD_PURCHASED_BEVEGRAM': {
      const purchasedBevegram = action.payload.purchasedBevegramPack.purchasedBevegram;
      const id = action.payload.purchasedBevegramPack.id;
      const newSummary = addPurchasedBevegramToPurchaseSummary(state.summary, purchasedBevegram);
      let newEntry = {}
      newEntry[id] = purchasedBevegram;
      const list = Object.assign({}, state.list, newEntry);

      return Object.assign({}, state, {
        summary: newSummary,
        list: list,
      });
    }
    case 'REMOVE_SENT_BEVEGRAM_FROM_PURCHASED': {
      const newSummary = removeSentBevegramFromPurchaseSummary(state.summary, action.payload.sentBevegramPack.sentBevegram);
      return Object.assign({}, state, {
        summary: newSummary,
      })
    }
    case 'SET_PURCHASED_BEVEGRAM_LIST': {
      return Object.assign({}, state, {
        list: action.payload.list,
      })
    }

    default:
      return state;
  }
}
