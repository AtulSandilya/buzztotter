const views = {
  first: 0,
  last: 3,
}

const initialState = {
  settings: {
    notifications: true,
    location: false,
  },
  currentView: views.first,
}

const toggleSetting = (state, key) => {
  // Create a cloned state object and assign the key the inverted value from the state
  let newState = Object.assign({}, state);
  newState.settings[key] = !state.settings[key];
  return newState;
}

function verifyViewPosition(newPosition){
  if(newPosition > views.max){
    return views.max;
  } else if (newPosition < views.min) {
    return views.min
  }
  return newPosition;
}

const gotoView = (state, newPosition) => {
  console.log("State from gotoView");
  console.log(state);
  return Object.assign({}, state, {currentView: verifyViewPosition(newPosition)});
}

// A reducer takes the current state and an action and returns the next state.
// It must be a pure function that does not alter state
const reducers = (state = initialState, action) => {
  switch(action.type){
    case 'TOGGLE_SETTING':
      return toggleSetting(state, action.settingName);
    case 'GOTO_VIEW':
      return gotoView(state, action.newPosition);
    default:
      return state;
  }
}

export default reducers;
