import secrets from '../../secrets';

const stripe_url = 'https://api.stripe.com/v1/';
const apiKey = secrets.stripeApiKey;

export const promiseCreditCardToken = (cardNumber, expMonth, expYear, cvc) => {
  const cardDetails = {
    "card[number]": cardNumber,
    "card[exp_month]": expMonth,
    "card[exp_year]": expYear,
    "card[cvc]": cvc,
  }

  let formBody = [];

  for(var prop in cardDetails){
    const encodedKey = encodeURIComponent(prop);
    const encodedValue = encodeURIComponent(cardDetails[prop]);
    formBody.push(encodedKey + "=" + encodedValue);
  }

  formBody = formBody.join("&");

  return fetch('https://api.stripe.com/v1/balance', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + secrets.stripeApiKey,
    }
  }).then((response) => {return response.json()})
  .catch((error) => {
    console.error("Error fetching creditCardToken: ", error);
  })
}

