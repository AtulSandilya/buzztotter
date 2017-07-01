// Only gets tokens for credit cards, nothing else!
import moment from "moment";
import publicApiKeys from "../publicApiKeys";

const stripeUrl = "https://api.stripe.com/v1/";
const stripeApiKey = publicApiKeys.stripe;

const uriEncodeObjectToString = (inputObj, separator = "&") => {
  const result = [];
  Object.keys(inputObj).forEach(key => {
    if (typeof inputObj[key] === "object") {
      result.push(uriEncodeNestedObject(inputObj[key], key));
    } else {
      result.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(inputObj[key]),
      );
    }
  });
  const strResult = result.join("&");
  return strResult;
};

// Stripe does not accept json via the api. But they do accept key/value pairs
// of an object. This function performs this conversion on an object. Example:
// const person = {first: "Test", last: "Name"};
// let personStr = uriEncodeNestedObject(person, "person")
// personStr = "person[first]=Test&person[last]=Name"

const uriEncodeNestedObject = (inputObj, objName) => {
  const result = [];
  const name = encodeURIComponent(objName);
  Object.keys(inputObj).forEach(key => {
    result.push(
      `${name}[${encodeURIComponent(key)}]=${encodeURIComponent(
        inputObj[key],
      )}`,
    );
  });
  return result.join("&");
};

const stripeRequest = (
  url: string,
  requestDetails: any,
  method: string = "POST",
) => {
  const body = uriEncodeObjectToString(requestDetails);
  return fetch(stripeUrl + url, {
    body: uriEncodeObjectToString(requestDetails),
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer " + stripeApiKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: method,
  })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      throw Error(`Error ${method}ing ${body} to ${url}: ${error}`);
    });
};

// Verify a credit card. Returns a token if verification is successful.
// This is the only stripe action that should be performed in the app (it must
// be performed in the app so credit card details don't touch our servers!)
// everything else should be done server side.
export const promiseCreditCardToken = (cardNumber, expMonth, expYear, cvc) => {
  const cardDetails = {
    card: {
      cvc: cvc,
      exp_month: expMonth,
      exp_year: expYear,
      number: cardNumber,
    },
  };

  return stripeRequest("tokens", cardDetails);
};
