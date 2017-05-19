import { GraphRequest, GraphRequestManager } from "react-native-fbsdk";

import {isNarrow} from "../ReactNativeUtilities";

const graphRequest = (token, urlString, parameterString, callback) => {
  // If parameterString is empty the the parameters object needs to be an
  // empty object else the graph api returns an error
  const requestParams = {};
  if (parameterString) {
    const fieldParam = "fields";
    requestParams[fieldParam] = {
      string: parameterString,
    };
  }

  return new GraphRequest(
    urlString,
    {
      accessToken: token.toString(),
      httpMethod: "GET",
      parameters: requestParams,
      version: "v2.7",
    },
    callback,
  );
};

const promiseFunctionFromFacebook = (token, inputFunction) => {
  const promise = new Promise((resolve, reject) => {
    new GraphRequestManager().addRequest(inputFunction(token, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    })).start();
  });
  return promise;
};

const getFriendsRequest = (token, callback) => {
  const urlString = "/me/friends?fields=picture.type(square),first_name,last_name,name,birthday,email&limit=5000";
  const parameterString = "";
  return graphRequest(token, urlString, parameterString, callback);
};

export const promiseContactsFromFacebook = (token) => {
  return promiseFunctionFromFacebook(token, getFriendsRequest);
};

const userInfoRequest = (token, callback) => {
  const urlString = "/me";
  const parameterString = "id, name, first_name, last_name, email, birthday";
  return graphRequest(token, urlString, parameterString, callback);
};

export const promiseUserInfoFromFacebook = (token) => {
  return promiseFunctionFromFacebook(token, userInfoRequest);
};

export const buildFacebookProfilePicUrlFromFacebookId = (facebookId: string): string => {
  const imageSize = isNarrow ? "" : "?type=large";
  return `https://graph.facebook.com/${facebookId}/picture${imageSize}`;
};
