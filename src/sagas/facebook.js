import { call, put } from 'redux-saga/effects';

import { promiseUserInfoFromFacebook, promiseContactsFromFacebook } from '../api/facebook';

export function* fetchContacts(action) {
  try{
    // Each yield completes before the other starts
    yield put({type: 'LOADING_CONTACTS_FROM_FACEBOOK'});
    const contacts = yield call(promiseContactsFromFacebook, action.payload.token);
    yield put({type: "POPULATE_CONTACTS_FROM_FACEBOOK", payload: {contacts: contacts}});
  } catch(e) {
    yield put({type: "LOADING_CONTACTS_FROM_FACEBOOK_FAILED"});
  }
}

export function* fetchUser(action) {
  try{
    const userData = yield call(promiseUserInfoFromFacebook, action.payload.token);
    yield put({type: 'POPULATE_USER_DATA_FROM_FACEBOOK', payload: {
      userData: userData,
      token: action.payload.token,
    }});
    fetchContacts(action);
  } catch(e){
    yield put({type: 'POPULATE_USER_DATA_FROM_FACEBOOK_FAILED'});
  }
}

export function* fetchAllFacebookData(action){
  // Execute these in parallel
  yield [
    fetchUser(action),
    fetchContacts(action),
  ]
}
