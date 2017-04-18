import moment from "moment";
import fetch from "node-fetch";

const stripeUrl = "https://api.stripe.com/v1/";
const stripePrivateApiKey = process.env.STRIPE_PRIVATE_API_KEY;

//  Perform Stripe Request ----------------------------------------------{{{

const uriEncodeObjectToString = (inputObj, separator = "&") => {
  const result = [];
  Object.keys(inputObj).forEach((key) => {
    if (typeof inputObj[key] === "object") {
      result.push(uriEncodeNestedObject(inputObj[key], key));
    } else {
      result.push(encodeURIComponent(key) + "=" + encodeURIComponent(inputObj[key]));
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
  Object.keys(inputObj).forEach((key) => {
    result.push(`${name}[${encodeURIComponent(key)}]=${encodeURIComponent(inputObj[key])}`);
  });
  return result.join("&");
};

const stripeRequest = async (
  url: string,
  requestDetails: any,
  method: string = "POST",
) => {
  const body = uriEncodeObjectToString(requestDetails);
  const response = await fetch(stripeUrl + url, {
    body: uriEncodeObjectToString(requestDetails),
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer " + stripePrivateApiKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: method,
  })
  .catch( (error) => {
    throw Error(`Error ${method}ing ${body} to ${url}: ${error}`);
  });
  const json = await response.json();

  if (json.error) {
    throw new StripeError(json.error.message);
  }

  return json;
};

//  End Perform Stripe Request ------------------------------------------}}}

export const promiseCreditCardPurchase = (customerId, amount, description) => {
  const purchaseDetails = {
    amount: amount,
    currency: "usd",
    customer: customerId,
    description: description,
  };

  return stripeRequest("charges", purchaseDetails);
};

// Create a new empty stripe customer
export const promiseNewCustomer = (fullName: string, email: string) => {
  const newCustomerDetails = {
    description: `${fullName}: ${email}`,
    metadata: {
      creationDate: moment().format("MM/DD/YYYY HH:MM:ss Z"),
      email: email,
      name: fullName,
    },
  };

  return stripeRequest("customers", newCustomerDetails);
};

export const promiseAddCardToCustomer = (customerId: string, token: string) => {
  const customerDetails = {
    source: token,
  };

  return stripeRequest("customers/" + customerId + "/sources", customerDetails);
};

export const promiseUpdateCustomerDefaultCard = (customerId: string, newDefaultCard: string) => {
  const update = {
    default_source: newDefaultCard,
  };

  return stripeRequest("customers/" + customerId, update);
};

export const promiseCustomer = (customerId: string) => {
  return stripeRequest("customers/" + customerId, {});
};

export const promiseDeleteCustomerCard = (customerId: string, cardToDelete: string) => {
  return stripeRequest("customers/" + customerId + "/sources/" + cardToDelete, {}, "DELETE");
};
