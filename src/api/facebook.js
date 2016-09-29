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
  const urlString = '/me/taggable_friends?fields=picture.type(square),first_name,last_name,name&limit=5000';
  const parameterString = "";
  return graphRequest(token, urlString, parameterString, callback);
}

export const promiseContactsFromFacebook = (token) => {
  return promiseFunctionFromFacebook(token, getFriendsRequest);
}

const userInfoRequest = (token, callback) => {
  const urlString = "/me";
  const parameterString = "id, name, first_name, last_name, email, birthday";
  return graphRequest(token, urlString, parameterString, callback);
}

export const promiseUserInfoFromFacebook = (token) => {
  return promiseFunctionFromFacebook(token, userInfoRequest);
}
