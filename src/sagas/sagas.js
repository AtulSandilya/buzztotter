import { takeEvery, takeLatest } from 'redux-saga';
import { call, put, fork } from 'redux-saga/effects';

import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

const graphRequest = (token, urlString, parameterString, callback) => {
  // If parameterString is empty the the parameters object needs to be an
  // empty object else the graph api returns an error
  let requestParams = {}
  if(parameterString){
    requestParams.fields = {
      string: parameterString,
    }
  }

  return new GraphRequest(
    urlString,
    {
      httpMethod: 'GET',
      version: 'v2.7',
      parameters: requestParams,
      accessToken: token.toString(),
    },
    callback,
  );
}

const promiseFunctionFromFacebook = (token, inputFunction) => {
  var promise = new Promise(function(resolve, reject){
    new GraphRequestManager().addRequest(inputFunction(token, function(error, result){
      if(error){
        reject(error);
      } else {
        resolve(result);
      }
    })).start();
  });
  return promise;
}

const getFriendsRequest = (token, callback) => {
  const urlString = '/me/invitable_friends?fields=picture.type(large),first_name,last_name,name&limit=5000';
  const parameterString = "";
  return graphRequest(token, urlString, parameterString, callback);
}

const promiseContactsFromFacebook = (token) => {
  return promiseFunctionFromFacebook(token, getFriendsRequest);
}

const userInfoRequest = (token, callback) => {
  const urlString = "/me";
  const parameterString = "id, name, first_name, last_name, email, birthday";
  return graphRequest(token, urlString, parameterString, callback);
}

const promiseUserInfoFromFacebook = (token) => {
  return promiseFunctionFromFacebook(token, userInfoRequest);
}

function* fetchContacts(action) {
  try{
    // Each yield completes before the other starts
    yield put({type: 'LOADING_CONTACTS_FROM_FACEBOOK'});
    const contacts = yield call(promiseContactsFromFacebook, action.payload.token);
    yield put({type: "POPULATE_CONTACTS_FROM_FACEBOOK", payload: {contacts: contacts}});
  } catch(e) {
    console.log("Fetch contacts failed: ", e);
    yield put({type: "LOADING_CONTACTS_FROM_FACEBOOK_FAILED"});
  }
}

function* fetchUser(action) {
  try{
    const userData = yield call(promiseUserInfoFromFacebook, action.payload.token);
    yield put({type: 'POPULATE_USER_DATA_FROM_FACEBOOK', payload: {userData: userData}});
    fetchContacts(action);
  } catch(e){
    yield put({type: 'POPULATE_USER_DATA_FROM_FACEBOOK_FAILED'});
  }
}

function* fetchAllFacebookData(action){
  // Execute these in parallel
  yield [
    fetchUser(action),
    fetchContacts(action),
  ]
}

// Like combine reducers
export default function* rootSaga() {
  yield fork(takeEvery, 'USER_FETCH_REQUESTED', fetchUser);
  yield fork(takeEvery, 'CONTACTS_FETCH_REQUESTED', fetchContacts);
  yield fork(takeEvery, 'ALL_FACEBOOK_DATA_FETCH_REQUESTED', fetchAllFacebookData);
}
