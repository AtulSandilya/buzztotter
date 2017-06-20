export const settingsKeys = {
  location: "location",
  notifications: "notifications",
};

export interface Settings {
  location: boolean;
  notifications: boolean;
}

const defaultSettings: Settings = {
  location: true,
  notifications: true,
};

export const settings = (state = defaultSettings, action) => {
  switch (action.type) {
    case "TOGGLE_SETTING":
      // Check if the settingKey passed is valid, if not return the original
      // state, ie don't toggle anything
      if (settingsKeys.hasOwnProperty(action.settingKey)) {
        return toggleSetting(state, action.settingKey);
      } else {
        return state;
      }
    default:
      return state;
  }
};

const toggleSetting = (state, key) => {
  // Create a cloned state object and assign the key the inverted value from the state
  const newState = { ...state };
  newState[key] = !state[key];
  return newState;
};
