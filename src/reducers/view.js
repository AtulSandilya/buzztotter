import { Actions } from 'react-native-router-flux';

export const sceneKeys = {
  contacts: "contacts",
  bevegrams: "bevegrams",
  bevegramLocations: "bevegramLocations",
  history: "history",
}

export let sceneOrder = {};
sceneOrder[sceneKeys.contacts]          = 0;
sceneOrder[sceneKeys.bevegrams]         = 1;
sceneOrder[sceneKeys.bevegramLocations] = 2;
sceneOrder[sceneKeys.history]           = 3;

const goToView = (state, newScene) => {
  let currentScenePos = sceneOrder[state[0]];
  let newScenePos = sceneOrder[newScene];

  // Choose the correct transition based on where each button is placed. If
  // the first scene is in view and the last scene is pressed the transition
  // should come from the left side of the screen. The reverse is also true.
  let transition = "";
  if(newScenePos > currentScenePos){
    transition = "horizontal";
  } else if(newScenePos < currentScenePos){
    transition = "leftToRight";
  } else {
    return state;
  }

  Actions[newScene]({direction: transition});

  // Copy the array and add the new scene to the front of the "stack"
  let newState =  [...state];
  newState.unshift(newScene);
  return newState
}

const goBackView = (state) => {
  if(state.length === 1){
    // We can't go back any further
    return state;
  }

  Actions[state[1]]({direction: "horizontal"});

  let newState =  [...state];
  // Pop from the front of the array
  newState.shift();
  return newState;
}

// view is a list of sceneKeys navigated to by the user. Position 0 is the
// current view, position 1 is the previous view, etc.
const defaultState = [
  sceneKeys.contacts,
]

export const view = (state = defaultState, action) => {
  switch(action.type){
    case 'GOTO_VIEW':
      return goToView(state, action.newScene);
    case 'GOBACK_VIEW':
      return goBackView(state);
    default:
      return state;
  }
}
