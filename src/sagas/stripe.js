import { call, put } from 'redux-saga/effects';

import { promiseCreditCardToken } from '../api/stripe';

export function* fetchCreditCardToken(action){
  try{
    const creditCardResult = yield call(promiseCreditCardToken);
    yield put({type: 'HANDLE_CREDIT_CARD_RESPONSE', payload: creditCardResult});
  } catch(e){
    yield put({type: 'HANDLE_FAILED_CREDIT_CARD_RESPONSE'});
  }
}
