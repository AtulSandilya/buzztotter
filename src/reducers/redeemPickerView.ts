import { Location } from "../db/tables";

interface RedeemPickerState {
  isRefreshingLocation: boolean;
  pickerLocations: Location[];
}

const defaultState: RedeemPickerState = {
  isRefreshingLocation: false,
  pickerLocations: [undefined, undefined, undefined],
};

export const redeemPickerView = (state = defaultState, action) => {
  switch (action.type) {
    case "ATTEMPTING_REDEEM_PICKER_LOCATION_REFRESH":
      return {
        ...state,
        isRefreshingLocation: true,
      };
    case "COMPLETED_REDEEM_PICKER_LOCATION_REFRESH":
      return {
        ...state,
        isRefreshingLocation: false,
      };
    case "UPDATE_REDEEM_PICKER":
      return {
        ...state,
        isRefreshingLocation: false,
        pickerLocations: action.payload.locations,
      };
    case "RESET_REDEEM_PICKER_VIEW":
      return defaultState;
    default:
      return state;
  }
};
