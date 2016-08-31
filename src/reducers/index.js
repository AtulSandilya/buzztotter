const initialState = {
  settings: {
    notifications: true,
    location: false,
  }
}

const toggleSetting = (state, key) => {
  // Create a cloned state object and assign the key the inverted value from the state
  let newState = Object.assign({}, state);
  newState.settings[key] = !state.settings[key];
  return newState;
}

// A reducer takes the current state and an action and returns the next state.
// It must be a pure function that does not alter state
const settings = (state = initialState, action) => {
  switch(action.type){
    case 'TOGGLE_SETTING':
      return toggleSetting(state, action.settingName);
    default:
      return state;
  }
}

export default settings;
