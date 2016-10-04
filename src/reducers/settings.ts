const nodePackage = require('../../package.json');
const version = nodePackage.version;

export const settingsKeys = {
  notifications: 'notifications',
  location: 'location',
}

const defaultSettings = {
  notifications: true,
  location: true,
  version: version,
}

export const settings = (state = defaultSettings, action) => {
  switch(action.type){
    case 'TOGGLE_SETTING':
      // Check if the settingKey passed is valid, if not return the original
      // state, ie don't toggle anything
      if(settingsKeys.hasOwnProperty(action.settingKey)){
        return toggleSetting(state, action.settingKey);
      } else {
        return state;
      }
    default:
      return state;
  }
}

const toggleSetting = (state, key) => {
  // Create a cloned state object and assign the key the inverted value from the state
  let newState = Object.assign({}, state);
  newState[key] = !state[key];
  return newState;
}
