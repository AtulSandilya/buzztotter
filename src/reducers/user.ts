import {User} from "../db/tables";
// null is used here because this is converted to json before writing to
// firebase and json uses null instead of undefined
const defaultState: User = {
  isLoggedIn: false,
};

const mapFacebookDataToState = (state, action): UserState => {
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

export const user = (state = defaultState, action): UserState => {
  switch(action.type){
    case('POPULATE_USER_DATA_FROM_FACEBOOK'):
      return mapFacebookDataToState(state, action);
    case 'LOGIN_FACEBOOK':
      return Object.assign({}, state, {
        isLoggedIn: true,
      });
    case 'LOGOUT_FACEBOOK':
      return Object.assign({}, state, {
        isLoggedIn: false,
      });
    case 'SUCCESSFUL_FIREBASE_LOGIN':
      return Object.assign({}, state, {
        firebase: action.payload.firebaseUser,
      })
    case 'STORE_FCM_TOKEN':
      return Object.assign({}, state, {
        fcmToken: action.payload.fcmToken,
    })
    case 'UPDATE_LAST_MODIFIED':
      return Object.assign({}, state, {
        lastModified: action.payload.lastModified,
    })

    default:
      return state;
  }
}
