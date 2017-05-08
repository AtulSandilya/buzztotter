import {Location} from "../db/tables";

export const defaultLocationsState = []

export const locations = (state = defaultLocationsState, action) => {
  switch (action.type) {
    case "REFRESH_LOCATIONS":
      return action.payload.locations;
    default:
      return state;
  }
};
