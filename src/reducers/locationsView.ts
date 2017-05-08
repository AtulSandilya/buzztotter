const defaultState = {
  isReloading: false,
};

export const locationsView = (state = defaultState, action) => {
  switch (action.type) {
    case "ATTEMPTING_LOCATION_NEAR_USER_UPDATE":
      return Object.assign({}, state, {
        isReloading: true,
      });
    case "SUCCESSFUL_LOCATION_NEAR_USER_UPDATE":
      return Object.assign({}, state, {
        isReloading: false,
      });
    default:
      return state;
  }
};
