import {
  PurchasedBevegram,
  PurchasedBevegramSummary,
} from '../db/tables';

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
    case 'SET_PURCHASED_BEVEGRAM_LIST': {
      return Object.assign({}, state, {
        list: action.payload.list,
      })
    }

    default:
      return state;
  }
}
