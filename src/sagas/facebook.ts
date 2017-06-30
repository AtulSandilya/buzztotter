import { delay } from "redux-saga";
import { call, put, select } from "redux-saga/effects";

import {
  User,
} from "../db/tables";

import {
  promiseContactsFromFacebook,
  promiseUserInfoFromFacebook,
} from "../api/facebook";

import * as facebookApi from "../api/facebook";

export function *login() {
  const accessToken = yield call(facebookApi.login);
  return accessToken;
}

export function *logout() {
  yield call(facebookApi.logout);
  yield put({type: "LOGOUT_FACEBOOK"});
}

export function* fetchContacts(facebookAccessToken: string) {
  try {
    // Each yield completes before the other starts
    yield put({type: "LOADING_CONTACTS_FROM_FACEBOOK"});
    const contacts = yield call(promiseContactsFromFacebook, facebookAccessToken);
    yield put({type: "POPULATE_CONTACTS_FROM_FACEBOOK", payload: {contacts: contacts}});
  } catch (e) {
    yield put({type: "FAILED_LOADING_CONTACTS_FROM_FACEBOOK"});
    throw FacebookFetchError("Unable to fetch contacts");
  }
}

export function* fetchUser(facebookAccessToken: string) {
  try {
    const userData = yield call(promiseUserInfoFromFacebook, facebookAccessToken);
    yield put({type: "POPULATE_USER_DATA_FROM_FACEBOOK", payload: {
      token: facebookAccessToken,
      userData: userData,
    }});
  } catch (e) {
    yield put({type: "POPULATE_USER_DATA_FROM_FACEBOOK_FAILED"});
    throw FacebookFetchError("Usable to fetch user data");
  }
}

export function *reloadContacts(action) {
  try {
    yield put({type: "RELOADING_CONTACTS_FROM_FACEBOOK"});
    const facebookToken: string = yield select<{user: User}>((state) => state.user.facebook.token);
    const contacts = yield call(promiseContactsFromFacebook, facebookToken);
    yield put({type: "POPULATE_CONTACTS_FROM_FACEBOOK", payload: {contacts: contacts}});
    yield put({type: "COMPLETED_RELOADING_CONTACTS_FROM_FACEBOOK"});
    yield put({type: "TOAST_CONTACTS_RELOADED"});
    yield delay(500);
    yield put({type: "END_TOAST_CONTACTS_RELOADED"});
  } catch (e) {
    yield put({type: "FAILED_RELOADING_CONTACTS_FROM_FACEBOOK"});
    throw FacebookFetchError("Unable to reload contacts");
  }
}

export function *successfulLogin() {
  yield put({type: "LOGIN_FACEBOOK"});
}

export function FacebookFetchError(message) {
  this.name = "FacebookFetchError";
  this.message = "Facebook Error: " + message;
  this.toString = () => {
    return this.message;
  };
  return this.toString();
}

export function* fetchAllFacebookData(action) {
  // Execute these in parallel
  yield [
    fetchUser(action),
    fetchContacts(action),
  ];
}
