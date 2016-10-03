const defaultState = {
  isLoggedIn: false,
}

export const login = (state = defaultState, action) => {
  switch(action.type){
    case 'LOG_IN':
      return setIsLoggedIn(state, true);
    case 'LOG_OUT':
      return setIsLoggedIn(state, false);
    default:
      return state;
  }
}

const setIsLoggedIn = (state, input) => {
  return Object.assign({}, state, {isLoggedIn: input});
}
