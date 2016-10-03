const defaultState = {
  isLoggedIn: false,
  facebook: {
    token: null,
    id: null,
  },
  google: {
    token: null
  },
  firstName: null,
  lastName: null,
  fullName: null,
  birthday: null,
  email: null,
}

const mapFacebookDataToState = (state, action) => {
  const data = action.payload.userData;
  return Object.assign({}, state,
    {
      isLoggedIn: true,
      facebook: {
        token: action.payload.token,
        id: action.payload.userData.id,
      },
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: data.name,
      birthday: data.birthday,
      email: data.email,
    }
  );
}

export const user = (state = defaultState, action) => {
  switch(action.type){
    case('POPULATE_USER_DATA_FROM_FACEBOOK'):
      return mapFacebookDataToState(state, action);
    case 'LOGOUT_FACEBOOK':
      return Object.assign({}, state,
        {
          isLoggedIn: false,
        }
      );
    default:
      return state;
  }
}
