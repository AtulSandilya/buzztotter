const views = {
  first: 0,
  last: 3,
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
  return Object.assign({}, state, {currentView: verifyViewPosition(newPosition)});
}

export const view = (state = {currentView: views.first}, action) => {
  switch(action.type){
    case 'GOTO_VIEW':
      return gotoView(state, action.newPosition);
    default:
      return state;
  }
}
