import {User} from "../db/tables";

const defaultState: User = {
  isLoggedIn: false,
};

const mapFacebookDataToState = (state, action): User => {
  const data = action.payload.userData;
  return Object.assign({}, state,
    {
      birthday: data.birthday,
      email: data.email,
      facebook: {
        id: action.payload.userData.id,
        token: action.payload.token,
      },
      firstName: data.first_name,
      fullName: data.name,
      isLoggedIn: true,
      lastName: data.last_name,
    },
  );
};

export const user = (state = defaultState, action): User => {
  switch (action.type) {
    case("POPULATE_USER_DATA_FROM_FACEBOOK"):
      return mapFacebookDataToState(state, action);
    case "LOGIN_FACEBOOK":
      return Object.assign({}, state, {
        isLoggedIn: true,
      });
    case "LOGOUT_FACEBOOK":
      return Object.assign({}, state, {
        isLoggedIn: false,
      });
    case "SUCCESSFUL_FIREBASE_LOGIN":
      return Object.assign({}, state, {
        firebase: action.payload.firebaseUser,
      });
    case "STORE_FCM_TOKEN":
      return Object.assign({}, state, {
        fcmToken: action.payload.fcmToken,
    });
    case "UPDATE_LAST_MODIFIED":
      return Object.assign({}, state, {
        lastModified: action.payload.lastModified,
    });
    case "REWRITE_USER":
      return Object.assign({}, action.payload.updatedUser);
    default:
      return state;
  }
};
