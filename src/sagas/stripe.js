import { call, put } from 'redux-saga/effects';

import { promiseCreditCardToken, promiseCreditCardPurchase } from '../api/stripe';

export function* fetchCreditCardToken(action){
  const cardData = action.payload.cardData;
  const purchaseData = action.payload.purchaseData;
  try{
    yield put({type: 'ATTEMPING_CREDIT_CARD_PURCHASE'});
    const creditCardTokenResponse = yield call(promiseCreditCardToken, cardData.cardNumber, cardData.cardExpMonth, cardData.cardExpYear, cardData.cardCvc);

    const creditCardToken = handleTokenResponse(creditCardTokenResponse);
    console.log(creditCardToken);

    yield put({type: 'HANDLE_CREDIT_CARD_VERIFIED', payload: creditCardToken});
    const creditCardPurchaseResponse = yield call(promiseCreditCardPurchase, creditCardToken, purchaseData.amount, purchaseData.description);

    const purchaseResult = handleTransactionResponse(creditCardPurchaseResponse);
    yield put({type: 'HANDLE_CREDIT_CARD_PURCHASE_SUCESSFUL', payload: purchaseResult});
  } catch(e){
    yield put({type: 'HANDLE_FAILED_CREDIT_CARD_RESPONSE', payload: e});
  }
}

const handleTokenResponse = (response) => {
  console.log("tokenResponse: ", response);
  if(response.error !== undefined){
    throw new CreditCardException("Could not get credit card token: " + response.error.message);
  }
  return response.id;
}

const handleTransactionResponse = (response) => {
  if(response.error !== undefined){
    throw new CreditCardException("Error with transaction: " + response.error.message);
  } else if (response.status !== "succeeded"){
    throw new CreditCardException("Payment did not succeed: " + response.failure_message);
  }
  return response;
}

const CreditCardException = (message) => {
  return "Processing Credit Card Exception: " + message;
}
