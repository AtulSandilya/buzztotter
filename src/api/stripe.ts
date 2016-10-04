/// <reference path="../../typings/modules/fetch.d.ts"/>

import secrets from '../secrets';

const stripe_url = 'https://api.stripe.com/v1/';
const apiKey = secrets.stripeApiKey;

const uriEncodeObjectToString = (inputObj, separator = "&") => {
  let result = [];
  Object.keys(inputObj).forEach(function(key){
    result.push(encodeURIComponent(key) + "=" + encodeURIComponent(inputObj[key]));
  })
  return result.join("&");
}

export const promiseCreditCardToken = (cardNumber, expMonth, expYear, cvc) => {
  const cardDetails = {
    "card[number]": cardNumber,
    "card[exp_month]": expMonth,
    "card[exp_year]": expYear,
    "card[cvc]": cvc,
  }

  return fetch('https://api.stripe.com/v1/tokens', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + secrets.stripeApiKey,
    },
    body: uriEncodeObjectToString(cardDetails),
  })
  .then((response) => {
    return response.json();
  })
  .catch((error) => {
    console.error("Error fetching creditCardToken: ", error);
    throw new Error("Error verifying credit card: " + error);
  })
}

export const promiseCreditCardPurchase = (token, amount, description) => {
  const purchaseDetails = {
    "amount": amount,
    "currency": "usd",
    "source": token,
    "description": description,
  }

  return fetch('https://api.stripe.com/v1/charges', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + secrets.stripeApiKey,
    },
    body: uriEncodeObjectToString(purchaseDetails),
  })
  .then((response) => {
    return response.json();
  })
  .catch((error) => {
    console.error("Error with card transaction: ", error);
    throw new Error("Error processing credit card transaction!");
  })
}
