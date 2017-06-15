const defaultState = {
  completedLocationFetch: false,
  failedLocationFetch: false,
  isReloading: false,
};

export const locationsView = (state = defaultState, action) => {
  switch (action.type) {
    case "ATTEMPTING_LOCATION_NEAR_USER_UPDATE":
      return {
        ...state,
        completedLocationFetch: false,
        failedLocationFetch: false,
        isReloading: true,
      };
    case "SUCCESSFUL_LOCATION_NEAR_USER_UPDATE":
      return {
        ...state,
        completedLocationFetch: true,
        isReloading: false,
      };
    case "FAILED_LOCATION_NEAR_USER_UPDATE":
      return {
        ...state,
        failedLocationFetch: true,
        isReloading: false,
      };
    default:
      return state;
  }
};
