import { call, put } from 'redux-saga/effects';

import { CardResponseData } from '../reducers/purchase';

import { promiseCreditCardToken, promiseCreditCardPurchase } from '../api/stripe';

export function* fetchCreditCardToken(action){
  const cardData = action.payload.cardData;
  const purchaseData = action.payload.purchaseData;
  try{
    yield put({type: 'ATTEMPING_CREDIT_CARD_PURCHASE'});
    const creditCardTokenResponse = yield call(promiseCreditCardToken, cardData.cardNumber, cardData.cardExpMonth, cardData.cardExpYear, cardData.cardCvc);

    const tokenResponse = yield call(handleTokenResponse, creditCardTokenResponse);

    yield put({type: 'HANDLE_CREDIT_CARD_VERIFIED', payload: tokenResponse});
    const creditCardPurchaseResponse = yield call(promiseCreditCardPurchase, tokenResponse.token, purchaseData.amount, purchaseData.description);

    const purchaseResult = yield call(handleTransactionResponse, creditCardPurchaseResponse);
    yield put({type: 'HANDLE_CREDIT_CARD_PURCHASE_SUCESSFUL', payload: purchaseResult});
  } catch(e){
    yield put({type: 'HANDLE_CREDIT_CARD_FAILED', payload: e.message});
  }
}

function* handleTokenResponse(response): CardResponseData {
  if(response.error !== undefined){
    let err = response.error.message;
    yield put({type: 'HANDLE_CREDIT_CARD_VERIFICATION_FAILED', payload: err});
    throw new CreditCardException("Unable to verify credit card: " + err);
  }

  return {
    token: response.id,
    brand: response.card.brand,
    last4: response.card.last4,
  }
}

function* handleTransactionResponse (response) {
  if(response.error !== undefined){
    let err = response.error.message;
    yield put({type: 'HANDLE_CREDIT_CARD_PURCHASE_FAILED', payload: err});
    throw new CreditCardException("Error with transaction: " + err);
  } else if (response.status !== "succeeded"){
    let err = response.failure_message
    yield put({type: 'HANDLE_CREDIT_CARD_PURCHASE_FAILED', payload: err});
    throw new CreditCardException("Payment did not succeed: " + err);
  }

  return response;
}

function CreditCardException(message){
  this.message = message;
  this.name = "CreditCardException";
}
