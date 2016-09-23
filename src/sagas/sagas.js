import { takeEvery, takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

const userInfoRequest = (token) => {
  return new GraphRequest(
    '/me',
  {
    httpMethod: 'GET',
    version: 'v2.7',
    parameters: {
      fields: {
        string: 'id, name, first_name, last_name, email, birthday',
      }
    },
    accessToken: token.toString(),
  },
  handleResponseFromFacebook,
  );
}

const getFriendsRequest = (token, callback) => {
  return new GraphRequest(
    '/me/invitable_friends?fields=picture.type(large),first_name,last_name,name&limit=5000',
  {
    httpMethod: 'GET',
    version: 'v2.7',
    parameters: {},
    accessToken: token.toString(),
  },
  callback,
  );
}

const getContactsFromFacebook = (token) => {
  return new GraphRequestManager().addRequest(getFriendsRequest(token)).start();
}

function promiseContactsFromFacebook(token) {
  var promise = new Promise(function(resolve, reject){
    new GraphRequestManager().addRequest(getFriendsRequest(token, function(error, result){
      if(error){
        alert("Request error: ", error.errorMessage);
        console.log("Request error: ", error);
      } else {
        console.log("Facebook result: ", result);
        resolve(result);
      }
    })).start();
  });
  return promise;
}

const handleResponseFromFacebook = (error, result) => {
  if(error){
    alert("Request error: ", error.errorMessage);
    console.log("Request error: ", error);
  } else {
    console.log("Facebook result: ", result);
    return result;
  }
}

function* fetchContacts(action) {
  try{
    const contacts = yield call(promiseContactsFromFacebook, action.payload.token);
    console.log("fetchContacts contacts: ", contacts);
    yield put({type: "POPULATE_CONTACTS_FROM_FACEBOOK", payload: {contacts: contacts}});
  } catch(e) {
    console.log("Fetch contacts failed: ", e);
    yield put({type: "FACEBOOK_CONTACTS_FAILED"});
  }
}

function* fetchUser(action) {
  try {
    const user = yield call(getContactsFromFacebook, action.payload.token);
    yield put({type: "USER_FETCH_SUCCEEDED", user: user});
    console.log("fetchUser result: ", user);
  } catch(e) {
    console.log("User fetch failed");
    yield put({type: "USER_FETCH_FAILED", message: e.message});
  }
}

function* mySaga() {
  yield* takeEvery("USER_FETCH_REQUESTED", fetchContacts);
}

export default mySaga;
