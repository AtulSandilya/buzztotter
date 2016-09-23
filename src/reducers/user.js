const defaultState = {
  isLoggedIn: false,
  facebook: {
    token: null
  },
  google: {
    token: null
  }
}

export const user = (state = defaultState, action) => {
  switch(action.type){
    case('FACEBOOK_LOGIN'):
      return {...state,
        isLoggedIn: true,
        facebook: {token: action.payload.token},
      }
    default:
      return state;
  }
}
