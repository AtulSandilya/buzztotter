import { User } from "../db/tables";

import { FacebookUserResponse } from "../api/facebook";

const defaultState: User = {
  isLoggedIn: false,
};

const mapFacebookUserToUser = (state, action): User => {
  const data: FacebookUserResponse = action.payload.userData;
  return {
    ...state,

    birthday: data.birthday,
    email: data.email,
    facebook: {
      id: action.payload.userData.id,
      token: action.payload.token,
    },
    firstName: data.first_name,
    fullName: data.name,
    gender: data.gender,
    isLoggedIn: true,
    lastName: data.last_name,
    min_age: data.age_range.min,
  };
};

export const user = (state = defaultState, action): User => {
  switch (action.type) {
    case "POPULATE_USER_DATA_FROM_FACEBOOK":
      return mapFacebookUserToUser(state, action);
    case "LOGIN_FACEBOOK":
      return {
        ...state,
        isLoggedIn: true,
      };
    case "LOGOUT_FACEBOOK":
      return {
        ...state,
        isLoggedIn: false,
      };
    case "SUCCESSFUL_FIREBASE_LOGIN":
      return {
        ...state,
        firebase: action.payload.firebaseUser,
      };
    case "STORE_FCM_TOKEN":
      return {
        ...state,
        fcmToken: action.payload.fcmToken,
      };
    case "UPDATE_LAST_MODIFIED":
      return {
        ...state,
        lastModified: action.payload.lastModified,
      };
    case "REWRITE_USER":
      return { ...action.payload.updatedUser };
    case "STORE_LAST_USER_LOCATION":
      return {
        ...state,
        lastUserCoords: action.payload.lastUserCoords,
      };
    default:
      return state;
  }
};
