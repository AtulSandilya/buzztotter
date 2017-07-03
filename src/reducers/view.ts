import { Actions } from "react-native-router-flux";

/* tslint:disable:object-literal-sort-keys */
export const sceneKeys = {
  contacts: "contacts",
  bevegrams: "bevegrams",
  bevegramLocations: "bevegramLocations",
  history: "history",
};

/* tslint:disable:no-magic-numbers */
export let sceneOrder = {};
sceneOrder[sceneKeys.contacts] = 0;
sceneOrder[sceneKeys.bevegrams] = 1;
sceneOrder[sceneKeys.bevegramLocations] = 2;
sceneOrder[sceneKeys.history] = 3;

const goToView = (state, newScene) => {
  // Don't track multiple presses
  if (newScene === state[0]) {
    return state;
  }

  // Copy the array and add the new scene to the front of the "stack"
  const newState = [...state];
  newState.unshift(newScene);
  return newState;
};

const goBackView = state => {
  if (state.length === 1) {
    // We can't go back any further
    return state;
  }

  const newState = [...state];
  // Pop from the front of the array
  newState.shift();
  return newState;
};

// view is a list of sceneKeys navigated to by the user. Position 0 is the
// current view, position 1 is the previous view, etc.
const defaultState = [sceneOrder[sceneKeys.contacts]];

export const view = (state = defaultState, action) => {
  switch (action.type) {
    case "GOTO_VIEW":
      return goToView(state, action.newScene);
    case "GOBACK_VIEW":
      return goBackView(state);
    default:
      return state;
  }
};
