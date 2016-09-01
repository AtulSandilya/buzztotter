export const settings = (state = {notifications: false, location: true}, action) => {
  switch(action.type){
    case 'TOGGLE_SETTING':
      return toggleSetting(state, action.settingName);
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
