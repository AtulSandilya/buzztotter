import fetchMock from 'fetch-mock';

import { fetchCreditCardToken, handleTokenResponse, handleTransactionResponse, CreditCardException} from '../../build/sagas/stripe.js';
import { promiseCreditCardToken, promiseCreditCardPurchase } from '../../build/api/stripe';
import {sampleTokenResponse, sampleTransactionResponse, sampleErrorResponse} from '../api/stripe-test';

export const cardData = {
  cardNumber: "4242424242424242",
  cardExpMonth: "12",
  cardExpYear: "20",
  cardCvc: "123",
};

export const purchaseData = {
  amount: 600,
  description: "test description",
}

const getAction = (input) => {
  return input.value.PUT.action;
}

describe('stripe saga', () => {
  const stripeApiUrl = "https://api.stripe.com/v1/"


  it('fetches credit card token successfully', () => {

    fetchMock.postOnce(stripeApiUrl + "tokens", sampleTokenResponse);

    const gen = fetchCreditCardToken({payload: {cardData: cardData, purchaseData: purchaseData}});

    let result = gen.next();
    expect(getAction(result).type).toEqual('ATTEMPING_CREDIT_CARD_PURCHASE');

    // Anytime the "return value" of yield via assignment (`val = yield thing`)
    // the result of the generator must be passed to the `next` generator
    result = gen.next(result);
    expect(result.value.CALL.fn).toEqual(promiseCreditCardToken);

    result = gen.next(result);
    expect(result.value.CALL.fn).toEqual(handleTokenResponse);

    result = gen.next(result);
    expect(result.value.PUT.action.type).toEqual('HANDLE_CREDIT_CARD_VERIFIED');

    result = gen.next(result);
    expect(result.value.CALL.fn).toEqual(promiseCreditCardPurchase);

    result = gen.next(result);
    expect(result.value.CALL.fn).toEqual(handleTransactionResponse);

    result = gen.next(result);
    expect(result.value.PUT.action.type).toEqual('HANDLE_CREDIT_CARD_PURCHASE_SUCESSFUL');

    result = gen.next(result);
    expect(result.done).toEqual(true);

  })
// Handle Token Response ---------------------------------------------- {{{

  it('should handle token response', () => {

    // To test a generator functions returned value you have to explicitly
    // step through each yield until you reach `done: true` in the returned
    // object

    let generator = handleTokenResponse(sampleTokenResponse);

    const result = generator.next();

    // test the returned value
    expect(result.value).toEqual({
      token: "tok_18y8HSK6oDSgnbJR3lVp3sPE",
      last4: "4242",
      brand: "Visa",
    })

    // Make sure the generator has completed
    expect(result.done).toBe(true);
  })

// End Handle Token Response ------------------------------------------ }}}
// Handle Token Response Error ---------------------------------------- {{{

  it('should handle token response error', () => {
    let gen = handleTokenResponse(sampleErrorResponse);

    // Testing the output of a `yield put`. This is what gets passed to the
    // reducer.
    expect(gen.next().value.PUT.action).toEqual({
      type: 'HANDLE_CREDIT_CARD_VERIFICATION_FAILED',
      payload: sampleErrorResponse.error.message,
    });

    // Calling a generator like this actually throws the error. To test an
    // exception from a generator this is what needs to execute.
    expect(() => {
      gen.next()
    }).toThrowError(/CreditCardException/);

  })

// End Handle Token Response Error ------------------------------------ }}}
// Handle Transaction Response ----------------------------------------- {{{

  it('should handle transaction response', () => {
    let gen = handleTransactionResponse(sampleTransactionResponse);

    let result = gen.next();
    expect(result.value).toEqual(sampleTransactionResponse);
    expect(result.done).toEqual(true);
  })

// End Handle Transaction Response ------------------------------------- }}}
})

