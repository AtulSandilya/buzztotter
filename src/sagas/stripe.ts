import { call, put } from "redux-saga/effects";

import { CardDataForVerification } from "../reducers/addCreditCard";

import {
  promiseCreditCardToken,
} from "../api/stripe";

export function *fetchCreditCardToken(action) {

  const cardData: CardDataForVerification = action.payload.cardData;
  try {
    yield put({type: "ATTEMPTING_CREDIT_CARD_VERIFICATION"});

    const creditCardTokenResponse = yield call(
      promiseCreditCardToken,
      cardData.cardNumber,
      cardData.cardExpMonth,
      cardData.cardExpYear,
      cardData.cardCvc,
    );

    if (creditCardTokenResponse.error) {
      throw new CreditCardError(creditCardTokenResponse.error.message);
    }

    // Return the token if successful
    return creditCardTokenResponse.id;
  } catch (e) {
    yield put({type: "FAILED_CREDIT_CARD_VERIFICATION", payload: {
      error: e.message,
    }});
    return;
  }
}

class CreditCardError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "CreditCardError";
  }
}
