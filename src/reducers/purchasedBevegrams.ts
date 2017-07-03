import { PurchasedBevegram, PurchasedBevegramSummary } from "../db/tables";

interface PurchasedBevegramState {
  summary: PurchasedBevegramSummary;
  list: object;
}

const defaultState = {
  list: {},
  summary: {
    availableToSend: 0,
    quantityPurchased: 0,
    sent: 0,
  },
};

export const purchasedBevegrams = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_PURCHASED_BEVEGRAM_LIST": {
      return {
        ...state,
        list: action.payload.list,
      };
    }

    default:
      return state;
  }
};
