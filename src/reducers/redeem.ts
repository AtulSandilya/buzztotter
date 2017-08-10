import { Location } from "../db/tables";

export interface RedeemStateProps {
  location: Location;
  quantity: number;
  receivedId: string;
}

const defaultState: RedeemStateProps = {
  location: undefined,
  quantity: 0,
  receivedId: undefined,
};

export const redeem = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_REDEEM_LOCATION":
      return {
        ...state,
        location: action.payload.loc,
      };
    case "SET_REDEEM_SELECTED_QUANTITY":
      return {
        ...state,
        quantity: action.payload.quantity,
      };
    case "SET_REDEEM_RECEIVED_BEVEGRAM_ID":
      return {
        ...state,
        receivedId: action.payload.receivedBevegramId,
      };
    case "RESET_REDEEM":
      return defaultState;
    default:
      return state;
  }
};
