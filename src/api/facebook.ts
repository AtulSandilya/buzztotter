import {
  AccessToken,
  AppInviteDialog,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from "react-native-fbsdk";

import { isNarrow } from "../ReactNativeUtilities";

type FacebookAccessToken = string;

export const login = async (): Promise<FacebookAccessToken> => {
  const loginResult = await LoginManager.logInWithReadPermissions([
    "public_profile",
    "user_friends",
    "email",
    "user_birthday",
  ]);

  if (!loginResult.isCancelled) {
    const accessTokenRequest = await AccessToken.getCurrentAccessToken();
    return accessTokenRequest.accessToken.toString();
  }

  return;
};

export const logout = () => {
  LoginManager.logOut();
};

export const appInvite = async () => {
  // TODO: Link this to the actual website
  const applinkUrl = "https://fb.me/2145387155685498";
  const appInviteData = await AppInviteDialog.show({
    applinkUrl,
  });

  return appInviteData ? true : false;
};

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
    new GraphRequestManager()
      .addRequest(
        inputFunction(token, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }),
      )
      .start();
  });
  return promise;
};

export interface FacebookFriendResponse {
  birthday: string;
  first_name: string;
  id: string;
  last_name: string;
  email: string;
  name: string;
  picture: {
    data: {
      is_silhouette: boolean;
      url: string;
    };
  };
}

const getFriendsRequest = (token, callback) => {
  const urlString =
    "/me/friends?fields=picture.type(square),first_name,last_name,name,birthday,email&limit=5000";
  const parameterString = "";
  return graphRequest(token, urlString, parameterString, callback);
};

export const promiseContactsFromFacebook = (
  token,
): Promise<FacebookFriendResponse[]> => {
  return promiseFunctionFromFacebook(token, getFriendsRequest);
};

/* tslint:disable:no-magic-numbers */
export interface FacebookUserResponse extends FacebookFriendResponse {
  age_range: {
    // An enum of ages for the user, useful if the user does not disclose a
    // birthday
    min?: 13 | 18 | 21;
    max?: 17 | 20 | undefined;
  };
  gender: string;
}

const userInfoRequest = (token, callback) => {
  const urlString = "/me";
  const parameterString =
    "id, name, first_name, last_name, email, birthday, gender, age_range";
  return graphRequest(token, urlString, parameterString, callback);
};

export const promiseUserInfoFromFacebook = (
  token,
): Promise<FacebookUserResponse> => {
  return promiseFunctionFromFacebook(token, userInfoRequest);
};

export const buildFacebookProfilePicUrlFromFacebookId = (
  facebookId: string,
): string => {
  const imageSize = isNarrow ? "" : "?type=large";
  return `https://graph.facebook.com/${facebookId}/picture${imageSize}`;
};
